--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0 (Debian 17.0-1.pgdg120+1)
-- Dumped by pg_dump version 17.0 (Debian 17.0-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: check_can_fit(integer, date, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_can_fit(input_machine_id integer, input_reservation_date date, input_amount_of_people integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN (
        SELECT
            CASE
                WHEN SUM(r.amount_of_people) IS NOT NULL THEN true
                ELSE false
            END AS can_fit
        FROM get_plan_machines_with_next_and_prev(input_machine_id, input_reservation_date) pm
        INNER JOIN reservation r ON r.plan_id = pm.plan_id
        INNER JOIN machine m ON m.machine_id = pm.machine_id
        WHERE ((pm.previous_start_time <= pm.end_time AND pm.previous_end_time >= pm.start_time) OR
               (pm.previous_start_time <= pm.next_end_time AND pm.previous_end_time >= pm.next_start_time) OR
               (pm.start_time <= pm.next_end_time AND pm.end_time >= pm.next_start_time))
          AND pm.can_disturb = true
          AND m.max_people >= r.amount_of_people + input_amount_of_people
    );
END;
$$;


ALTER FUNCTION public.check_can_fit(input_machine_id integer, input_reservation_date date, input_amount_of_people integer) OWNER TO postgres;

--
-- Name: get_machines_in_same_category(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_machines_in_same_category(input_machine_id integer) RETURNS TABLE(machine_id integer, machine_name character varying, max_weight double precision, min_weight double precision, max_people integer, avg_time_taken integer, popularity_score integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT m.*
    FROM machine m
    JOIN machine_exercise_type met ON m.machine_id = met.machine_id
    JOIN exercise_type et ON met.exercise_type_id = et.exercise_type_id
    WHERE et.category_id = (
        SELECT et.category_id
        FROM machine_exercise_type met
        JOIN exercise_type et ON met.exercise_type_id = et.exercise_type_id
        WHERE met.machine_id = input_machine_id
        LIMIT 1
    )
    AND m.machine_id != input_machine_id
    ORDER BY m.popularity_score DESC; -- Sorting by popularity_score in descending order
END;
$$;


ALTER FUNCTION public.get_machines_in_same_category(input_machine_id integer) OWNER TO postgres;

--
-- Name: get_plan_machines_occupancy_for_reservation(integer, date, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_plan_machines_occupancy_for_reservation(input_machine_id integer, input_reservation_date date, input_amount_of_people integer) RETURNS TABLE(plan_id integer, machine_id integer, can_disturb boolean, start_time time without time zone, end_time time without time zone, previous_plan_id integer, previous_start_time time without time zone, previous_end_time time without time zone, next_plan_id integer, next_start_time time without time zone, next_end_time time without time zone, can_fit boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
SELECT pm.*,
    CASE
        WHEN
            ((pm.previous_start_time <= pm.end_time AND pm.previous_end_time >= pm.start_time) OR
             (pm.previous_start_time <= pm.next_end_time AND pm.previous_end_time >= pm.next_start_time) OR
             (pm.start_time <= pm.next_end_time AND pm.end_time >= pm.next_start_time))
            AND m.max_people >= SUM(r.amount_of_people) + input_amount_of_people
        THEN true
        ELSE false
    END AS can_fit
FROM get_plan_machines_with_next_and_prev(input_machine_id, input_reservation_date) pm
INNER JOIN reservation r ON r.plan_id = pm.plan_id
INNER JOIN machine m ON m.machine_id = pm.machine_id
GROUP BY
    pm.plan_id, pm.machine_id, pm.can_disturb, pm.start_time, pm.end_time,
    pm.previous_plan_id, pm.previous_start_time, pm.previous_end_time,
    pm.next_plan_id, pm.next_start_time, pm.next_end_time,
    r.amount_of_people, m.max_people;
END;
$$;


ALTER FUNCTION public.get_plan_machines_occupancy_for_reservation(input_machine_id integer, input_reservation_date date, input_amount_of_people integer) OWNER TO postgres;

--
-- Name: get_plan_machines_with_next_and_prev(integer, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_plan_machines_with_next_and_prev(input_machine_id integer, input_reservation_date date) RETURNS TABLE(plan_id integer, machine_id integer, can_disturb boolean, start_time time without time zone, end_time time without time zone, previous_plan_id integer, previous_start_time time without time zone, previous_end_time time without time zone, next_plan_id integer, next_start_time time without time zone, next_end_time time without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
        SELECT
            pm.plan_id,
            pm.machine_id,
            pm.can_disturb,
            pm.start_time AS current_start_time,
            pm.end_time AS current_end_time,
            LAG(pm.plan_id) OVER (
                ORDER BY pm.start_time, pm.end_time
                ) AS previous_plan_id,
            LAG(pm.start_time) OVER (
                ORDER BY pm.start_time, pm.end_time
                ) AS previous_start_time,
            LAG(pm.end_time) OVER (
                ORDER BY pm.start_time, pm.end_time
                ) AS previous_end_time,
            LEAD(pm.plan_id) OVER (
                ORDER BY pm.start_time, pm.end_time
                ) AS next_plan_id,
            LEAD(pm.start_time) OVER (
                ORDER BY pm.start_time, pm.end_time
                ) AS next_start_time,
            LEAD(pm.end_time) OVER (
                ORDER BY pm.start_time, pm.end_time
                ) AS next_end_time
        FROM
            plan_machine pm inner join reservation on pm.plan_id = reservation.plan_id
        WHERE
            pm.machine_id = input_machine_id
          and TO_CHAR(reservation_time, 'YYYY-MM-DD') = TO_CHAR(input_reservation_date, 'YYYY-MM-DD')
        ORDER BY
            current_start_time, current_end_time;
END;
$$;


ALTER FUNCTION public.get_plan_machines_with_next_and_prev(input_machine_id integer, input_reservation_date date) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    account_id integer NOT NULL,
    first_name character varying(64) NOT NULL,
    last_name character varying(64) NOT NULL,
    login character varying(64) NOT NULL,
    role character varying(1) DEFAULT 'c'::character varying NOT NULL,
    email character varying(128) NOT NULL,
    phone_number character varying(32),
    is_active boolean DEFAULT true NOT NULL,
    create_date date DEFAULT now() NOT NULL,
    last_online date DEFAULT now() NOT NULL,
    address_id integer,
    credits integer DEFAULT 0 NOT NULL,
    clerk_id character varying(255) NOT NULL,
    profile_picture_url character varying(255)
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: account_accountid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_accountid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_accountid_seq OWNER TO postgres;

--
-- Name: account_accountid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_accountid_seq OWNED BY public.account.account_id;


--
-- Name: address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.address (
    address_id integer NOT NULL,
    street character varying(128) NOT NULL,
    city character varying(128) NOT NULL,
    postal_code character varying(16) NOT NULL,
    country character varying(64) NOT NULL,
    building_number character varying(16) NOT NULL,
    apartment_number character varying(16)
);


ALTER TABLE public.address OWNER TO postgres;

--
-- Name: address_addressid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.address_addressid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.address_addressid_seq OWNER TO postgres;

--
-- Name: address_addressid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.address_addressid_seq OWNED BY public.address.address_id;


--
-- Name: exercise_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercise_category (
    category_id integer NOT NULL,
    category_name character varying NOT NULL
);


ALTER TABLE public.exercise_category OWNER TO postgres;

--
-- Name: exercise_category_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exercise_category_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exercise_category_category_id_seq OWNER TO postgres;

--
-- Name: exercise_category_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exercise_category_category_id_seq OWNED BY public.exercise_category.category_id;


--
-- Name: exercise_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercise_type (
    exercise_type_id integer NOT NULL,
    type_name character varying(64) NOT NULL,
    category_id integer,
    body_part character varying(32) NOT NULL
);


ALTER TABLE public.exercise_type OWNER TO postgres;

--
-- Name: exercisetype_exercisetypeid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exercisetype_exercisetypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exercisetype_exercisetypeid_seq OWNER TO postgres;

--
-- Name: exercisetype_exercisetypeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exercisetype_exercisetypeid_seq OWNED BY public.exercise_type.exercise_type_id;


--
-- Name: machine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.machine (
    machine_id integer NOT NULL,
    machine_name character varying(64) NOT NULL,
    max_weight double precision,
    min_weight double precision,
    max_people integer DEFAULT 2 NOT NULL,
    avg_time_taken integer DEFAULT 300 NOT NULL,
    popularity_score integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.machine OWNER TO postgres;

--
-- Name: machine_exercise_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.machine_exercise_type (
    exercise_type_id integer NOT NULL,
    machine_id integer NOT NULL
);


ALTER TABLE public.machine_exercise_type OWNER TO postgres;

--
-- Name: plan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan (
    plan_id integer NOT NULL,
    plan_name character varying(64) NOT NULL,
    account_id integer NOT NULL
);


ALTER TABLE public.plan OWNER TO postgres;

--
-- Name: plan_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_category (
    plan_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.plan_category OWNER TO postgres;

--
-- Name: plan_machine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_machine (
    plan_id integer NOT NULL,
    machine_id integer NOT NULL,
    sets integer DEFAULT 4 NOT NULL,
    reps integer DEFAULT 8 NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    can_disturb boolean DEFAULT false
);


ALTER TABLE public.plan_machine OWNER TO postgres;

--
-- Name: plan_machine_preset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_machine_preset (
    plan_preset_id integer NOT NULL,
    machine_id integer NOT NULL,
    sets integer DEFAULT 4 NOT NULL,
    reps integer DEFAULT 8 NOT NULL
);


ALTER TABLE public.plan_machine_preset OWNER TO postgres;

--
-- Name: plan_preset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_preset (
    plan_preset_id integer NOT NULL,
    preset_name character varying(64) NOT NULL,
    author_id integer NOT NULL
);


ALTER TABLE public.plan_preset OWNER TO postgres;

--
-- Name: reservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation (
    reservation_id integer NOT NULL,
    amount_of_people integer DEFAULT 1 NOT NULL,
    reservation_time timestamp without time zone NOT NULL,
    customer_id integer NOT NULL,
    trainer_id integer,
    plan_id integer NOT NULL
);


ALTER TABLE public.reservation OWNER TO postgres;

--
-- Name: reservation_reservetionid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservation_reservetionid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservation_reservetionid_seq OWNER TO postgres;

--
-- Name: reservation_reservetionid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservation_reservetionid_seq OWNED BY public.reservation.reservation_id;


--
-- Name: test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test (
    id integer NOT NULL,
    test character varying(64) NOT NULL
);


ALTER TABLE public.test OWNER TO postgres;

--
-- Name: test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.test_id_seq OWNER TO postgres;

--
-- Name: test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_id_seq OWNED BY public.test.id;


--
-- Name: wrkoutmachine_wrkoutmachineid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wrkoutmachine_wrkoutmachineid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wrkoutmachine_wrkoutmachineid_seq OWNER TO postgres;

--
-- Name: wrkoutmachine_wrkoutmachineid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wrkoutmachine_wrkoutmachineid_seq OWNED BY public.machine.machine_id;


--
-- Name: wrkoutplan_wrkoutplanid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wrkoutplan_wrkoutplanid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wrkoutplan_wrkoutplanid_seq OWNER TO postgres;

--
-- Name: wrkoutplan_wrkoutplanid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wrkoutplan_wrkoutplanid_seq OWNED BY public.plan.plan_id;


--
-- Name: account account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account ALTER COLUMN account_id SET DEFAULT nextval('public.account_accountid_seq'::regclass);


--
-- Name: address address_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address ALTER COLUMN address_id SET DEFAULT nextval('public.address_addressid_seq'::regclass);


--
-- Name: exercise_category category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_category ALTER COLUMN category_id SET DEFAULT nextval('public.exercise_category_category_id_seq'::regclass);


--
-- Name: exercise_type exercise_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_type ALTER COLUMN exercise_type_id SET DEFAULT nextval('public.exercisetype_exercisetypeid_seq'::regclass);


--
-- Name: machine machine_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machine ALTER COLUMN machine_id SET DEFAULT nextval('public.wrkoutmachine_wrkoutmachineid_seq'::regclass);


--
-- Name: plan plan_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan ALTER COLUMN plan_id SET DEFAULT nextval('public.wrkoutplan_wrkoutplanid_seq'::regclass);


--
-- Name: reservation reservation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation ALTER COLUMN reservation_id SET DEFAULT nextval('public.reservation_reservetionid_seq'::regclass);


--
-- Name: test id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test ALTER COLUMN id SET DEFAULT nextval('public.test_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (133, 'Jan', 'Zahradnik', 'profiq', 'c', 'jan.zahradnik@profiq.com', NULL, true, '2024-10-19', '2024-10-19', 73, 0, 'user_2neSG9S1XrTx86YhJWhApLE0Q3S', 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybmVTRzgxakgxbW1Rd3RtUDJteVdkTGdZcFMifQ');
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (128, 'Jan-Kryštof', 'Zahradník', 'testoros', 'c', 'krystofjanwastaken@gmail.com', NULL, true, '2024-10-12', '2024-10-12', 69, 0, 'user_2nKTn6uRFJEFDY8cKgXxU6IJVwk', 'https://preview.redd.it/new-profile-pictures-for-yall-v0-brdjms2xte3c1.jpg?width=720&format=pjpg&auto=webp&s=ee4dd7a6b958c218987219c7ba5311424d2a3345');
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (4, 'Kill', 'Me', 'popi2', 't', 'killme2@pls.com', '+420 324 546 656', true, '2024-09-17', '2024-09-17', 2, 0, 'Non', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (6, 'Jonas', 'You', 'popi3', 't', 'killme@pls.com', '+420 324 546 656', true, '2024-09-27', '2024-09-26', 3, 0, 'Ese', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (3, 'Kill', 'You', 'popi', 't', 'killme@pls.com', '+340 291 232 111', true, '2024-09-17', '2024-09-17', 2, 0, 'NAN', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (1, 'Jan-Kryštof', 'Zahradník', 'zahry', 'e', 'jendazah@gmail.com', NULL, true, '2024-09-26', '2024-09-26', 3, 0, 'user_2mcZZtJs0f4vZVWv8qIaqSLsoa4', 'https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybWNaWnR6V05HNjhjbW5UOGlsSzdybGQxN3IifQ&w=1920&q=75');


--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (3, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (5, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (7, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (8, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (9, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (10, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (11, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (12, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (13, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (14, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (15, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (16, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (17, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (18, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (19, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (20, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (21, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (22, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (23, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (24, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (25, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (27, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (28, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (29, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (30, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (31, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (32, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (33, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (34, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (35, 'Vedlejsi', 'Ostrava', '734 35', 'CZE', '123/2', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (36, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (37, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (38, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (40, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (41, 'Hlavní třída', 'Frýdek-Místek', '734 34', 'CZE', '123/2', '32A');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (42, 'jk', 'jk', 'jk', 'Posad', 'jk', 'kj');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (43, 'test', 'test', 'test', 'test', 'test', 'test');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (44, 'asd', 'hjl', 'kj', 'Esketit', 'lkj', 'lkj');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (45, 'kjh', 'kjh', 'kjh', 'jkh', 'jkh', 'kjh');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (46, 'kjh', 'kjh', 'kjh', 'jkh', 'jkh', 'kjh');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (47, 'hkj', 'hjk', 'hk', 'eshjkh', 'jhkjh', 'jkh');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (48, 'kjh', 'kjh', 'kjh', 'kjh', 'kjh', 'kjh');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (49, 'hk', 'hkj', 'hkj', 'hkj', 'hkj', 'hjkh');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (50, 'eksad', 'jklj', 'lkj', 'esketit', 'lkj', 'lkjlkj');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (51, '', '', '', '', '', '');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (52, '', '', '', '', '', '');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (54, 'Streetus', 'Maximus', 'ApartmentNumber', 'More', 'qApartmentNumber', 'ApartmentNumber');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (2, 'Vedlejší třída', 'Profiq', '839 23', 'Profiq', '2323', '32');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (55, 'Streetus maximus', 'Citius minimus', '839 92', 'Ormus', '22', '33');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (56, 'Streetus maximus', 'Citius minimus', '839 92', 'Ormus', '22', '33');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (57, 'esketit', 'kl', 'kjl', 'jl', 'kj', 'lkjlkj');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (58, 'ghjhg', 'jhg', 'jhg', 'jhg', 'jhg', 'jhgj');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (59, 'hkj', 'hkjh', 'kj', 'kjh', 'hkj', 'hkjh');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (60, 'hk', 'jhjk', 'hkj', 'hkj', 'hk', 'jhjk');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (61, 'hk', 'jhjk', 'hkj', 'hkj', 'hk', 'jhjk');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (62, 'kasdasd', 'klj', 'jkl', 'hkjlh', 'hkjl', 'hkljh');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (63, 'kkljh', 'lkjhljkh', 'lkjh', 'lkjh', 'lkjh', 'ljkhlkjhlkjh');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (64, 'laskjdlkasjdkl', 'kjhkj', 'hjk', 'hjk', 'hkj', 'hkjhjkh');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (65, 'Streetus', 'Maximus', '323 03', 'Gigantus', '32', '33');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (66, 'Golem', 'Golem', '434', 'Golem', '434', '999');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (67, 'Streetus maximus', 'Citium minumus', '828 91', 'Esketit', '32', 'dd');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (68, 'Esketit', 'Esketit', '832 83', 'Esketit', 'asd', 'asdasd');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (69, 'hjljlkj', 'lkj', 'lkj', 'lkj', 'kljkljllkj', 'lkj');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (1, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (70, 'Penas', 'Madrid', '832 12', 'Fuite mala', '231', '21');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (71, 'Duckworth', 'Madrid', '832 29', 'Fuite mala', '22', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (72, 'Puppy', 'Duckworthville', '732 83', 'Fuite mala', '22', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (73, 'Esketit', 'Eksa', 'kjhh', 'ljhkjhkjh', '33', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (74, 'Vedlejsi', 'Ostrava', '734 35', 'CZE', '123/2', NULL);


--
-- Data for Name: exercise_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.exercise_category (category_id, category_name) VALUES (1, 'Upper body');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (2, 'Lower body');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (3, 'Chest');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (4, 'Back');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (5, 'Legs');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (6, 'Shoulders');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (7, 'Arms');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (8, 'Glutes');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (9, 'Core');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (10, 'Full Body');


--
-- Data for Name: exercise_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (2, 'Squat', 2, 'Glutes');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (1, 'Lateral raises', 1, 'Deltoids');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (3, 'Bicep curl', 1, 'Biceps');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (5, 'Bicep curl', 1, 'Bicepz');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (6, 'Cable Chest Fly', 1, 'Chest');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (7, 'Dumbbell Curl', 5, 'Arms');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (8, 'Kettlebell Swing', 6, 'Glutes');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (9, 'Bench Press', 1, 'Chest');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (10, 'Leg Press', 3, 'Legs');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (11, 'Smith Machine Squat', 6, 'Glutes');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (12, 'Barbell Squat', 3, 'Legs');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (13, 'Lat Pulldown', 2, 'Back');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (14, 'Chest Press', 1, 'Chest');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (15, 'Seated Row', 2, 'Back');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (16, 'Incline Press', 1, 'Chest');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (17, 'Hack Squat', 3, 'Legs');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (18, 'Shoulder Press', 4, 'Shoulders');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (19, 'Cable Crossover', 1, 'Chest');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (20, 'Chest Fly', 1, 'Chest');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (21, 'Weighted Dip', 1, 'Chest');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (22, 'Assisted Pull-Up', 2, 'Back');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (23, 'Vertical Leg Press', 3, 'Legs');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (24, 'Hip Thrust', 6, 'Glutes');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (25, 'Multi Press', 8, 'Full Body');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (26, 'Functional Trainer Exercise', 8, 'Full Body');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (27, 'Hammer Strength Press', 1, 'Chest');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (28, 'barbell bent over rows', 1, 'Back');


--
-- Data for Name: machine; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (25, 'Cables', 64, 3, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (3, 'Dumbells', 55, 0.5, 15, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (2, 'Kettle bells', 30, 5, 5, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (1, 'Bench press', 225, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (27, 'Leg Press Machine', 400, 30, 1, 300, 85);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (28, 'Smith Machine', 300, 15, 1, 450, 88);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (29, 'Squat Rack', 300, 20, 1, 400, 95);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (30, 'Lat Pulldown Machine', 150, 5, 1, 300, 65);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (31, 'Chest Press Machine', 220, 10, 1, 250, 80);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (32, 'Seated Row Machine', 200, 10, 1, 300, 75);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (33, 'Incline Press Machine', 200, 20, 1, 350, 82);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (34, 'Hack Squat Machine', 350, 25, 1, 400, 78);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (35, 'Shoulder Press Machine', 180, 10, 1, 300, 70);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (36, 'Cable Crossover Machine', 100, 5, 2, 350, 76);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (37, 'Chest Fly Machine', 200, 10, 1, 250, 72);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (38, 'Power Rack', 400, 20, 1, 500, 90);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (39, 'Dip Machine', 150, 5, 1, 250, 65);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (40, 'Assisted Pull-Up Machine', 120, 10, 1, 300, 68);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (41, 'Vertical Leg Press', 320, 30, 1, 350, 83);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (42, 'Hip Thrust Machine', 250, 20, 1, 300, 75);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (43, 'Multipress Machine', 300, 15, 1, 400, 85);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (44, 'Functional Trainer', 150, 10, 2, 450, 80);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (45, 'Hammer Strength Machine', 300, 15, 1, 400, 88);


--
-- Data for Name: machine_exercise_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (1, 25);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (2, 1);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (14, 25);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (2, 3);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (3, 2);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (5, 27);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (6, 28);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (7, 29);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (8, 30);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (9, 31);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (10, 32);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (11, 33);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (12, 34);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (13, 35);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (15, 37);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (16, 39);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (17, 40);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (18, 41);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (19, 42);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (20, 43);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (21, 44);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (22, 45);


--
-- Data for Name: plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (10, 'Profiq', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (11, 'Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (12, 'Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (1, 'Lets get Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (13, 'Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (14, 'Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (15, 'Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (17, 'Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (22, 'Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (23, 'Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (24, 'Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (25, 'Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (26, 'Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (31, 'tghdsefb', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (32, 'Testing UI', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (33, 'jkhgjkhg', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (34, 'asddsd', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (35, 'asdasd', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (36, 'asdasd', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (37, 'asdfasdf', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (42, 'Teemo', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (43, 'sadfasdf', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (44, 'sdfsdf', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (45, 'asdasd', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (46, 'asdfasdfasdf', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (47, 'gsdfgsdfg', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (48, 'JeffNumber2', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (49, 'Blue suede', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (50, 'sdafasdf', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (51, 'asdasdgjhghgjfhjdghdgfhdsdtyhrdhgc', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (52, 'asdasdgjhghgjfhjdghdgfhdsdtyhrdhgc', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (53, 'sredyt', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (54, 'xdvcghfgh', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (55, 'asdfasdfhyjgfhj', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (56, 'Testing1231', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (57, 'Linecke kolecka', 1);


--
-- Data for Name: plan_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.plan_category (plan_id, category_id) VALUES (1, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (1, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (22, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (22, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (23, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (23, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (24, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (24, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (25, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (25, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (26, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (26, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (31, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (32, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (33, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (34, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (35, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (36, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (37, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (42, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (43, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (44, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (45, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (46, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (47, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (48, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (49, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (50, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (51, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (52, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (53, 3);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (54, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (55, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (56, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (57, 2);


--
-- Data for Name: plan_machine; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (1, 1, 5, 1, '19:47:57', '19:54:59', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (1, 2, 8, 2, '19:47:57', '20:50:00', true);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (17, 2, 3, 2, '19:47:57', '20:47:57', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (17, 3, 3, 2, '19:50:57', '20:47:57', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (22, 2, 3, 2, '19:47:57', '20:47:57', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (22, 3, 3, 2, '19:50:57', '20:47:57', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (23, 2, 3, 2, '19:47:57', '20:47:57', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (23, 3, 3, 2, '19:50:57', '20:47:57', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (24, 2, 3, 2, '19:47:57', '20:47:57', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (24, 3, 3, 2, '19:50:57', '20:47:57', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (25, 2, 3, 2, '19:47:57', '20:47:57', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (25, 3, 3, 2, '19:50:57', '20:47:57', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (26, 2, 3, 2, '19:47:57', '20:47:57', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (26, 3, 3, 2, '19:50:57', '20:47:57', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (31, 25, 5, 7, '02:02:00', '02:02:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (32, 3, 5, 7, '20:02:00', '02:21:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (33, 25, 5, 7, '23:45:00', '23:45:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (33, 29, 4, 20, '23:45:00', '23:45:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (33, 41, 15, 20, '23:45:00', '23:59:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (34, 25, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (35, 28, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (36, 28, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (37, 25, 3, 8, '02:01:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (37, 29, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (42, 25, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (43, 25, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (43, 3, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (43, 2, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (44, 36, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (45, 40, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (45, 39, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (46, 25, 4, 6, '00:00:00', '01:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (47, 25, 4, 6, '23:22:00', '23:44:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (50, 25, 4, 6, '01:15:00', '01:35:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (51, 25, 4, 6, '03:00:00', '04:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (51, 29, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (52, 25, 4, 6, '03:00:00', '04:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (52, 29, 4, 6, '00:00:00', '00:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (53, 25, 4, 6, '10:25:00', '10:28:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (56, 25, 4, 6, '10:25:00', '10:35:00', true);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (55, 25, 4, 6, '01:15:00', '01:30:00', true);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (48, 25, 4, 5, '10:13:00', '10:15:00', true);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (49, 25, 4, 8, '10:15:00', '10:25:00', true);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (54, 25, 4, 6, '00:00:00', '00:00:00', true);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (57, 25, 4, 4, '10:15:00', '10:20:00', true);


--
-- Data for Name: plan_machine_preset; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: plan_preset; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (11, 30, '2024-11-17 17:26:14', 3, NULL, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (6, 5, '2024-11-17 17:26:14', 1, NULL, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (9, 2, '2024-11-17 17:26:14', 1, NULL, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (10, 2, '2024-11-17 17:26:14', 1, NULL, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (1, 3, '2024-10-17 19:26:14', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (12, 2, '2024-11-17 17:26:14', 3, NULL, 13);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (13, 2, '2024-11-17 17:26:14', 3, NULL, 14);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (14, 2, '2024-11-17 17:26:14', 3, NULL, 15);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (15, 2, '2024-11-17 17:26:14', 3, NULL, 17);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (16, 2, '2024-11-17 17:26:14', 3, NULL, 22);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (17, 2, '2024-11-17 17:26:14', 3, NULL, 23);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (18, 2, '2024-11-17 17:26:14', 3, NULL, 24);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (19, 2, '2024-11-17 17:26:14', 3, 4, 25);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (21, 2, '2024-11-17 17:26:14', 3, NULL, 26);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (24, 11, '2024-12-27 23:00:00', 1, NULL, 31);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (25, 11, '2024-12-07 23:00:00', 1, NULL, 32);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (26, 11, '2024-12-12 23:00:00', 1, NULL, 33);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (27, 1, '2024-12-13 23:00:00', 1, NULL, 34);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (28, 2, '2024-12-11 23:00:00', 1, NULL, 35);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (29, 2, '2024-12-11 23:00:00', 1, 6, 36);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (30, 1, '2024-12-13 23:00:00', 1, 4, 37);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (31, 1, '2024-12-21 23:00:00', 1, 6, 42);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (32, 1, '2024-12-21 23:00:00', 1, 6, 43);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (33, 1, '2024-12-22 23:00:00', 1, NULL, 44);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (34, 1, '2024-12-27 23:00:00', 1, 6, 45);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (35, 1, '2024-12-11 23:00:00', 1, NULL, 46);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (36, 1, '2024-12-11 23:00:00', 1, NULL, 47);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (48, 1, '2024-12-11 23:00:00', 1, NULL, 48);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (37, 1, '2024-12-11 23:00:00', 1, NULL, 49);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (38, 1, '2024-12-10 23:00:00', 1, NULL, 50);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (39, 1, '2024-12-10 23:00:00', 1, NULL, 51);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (40, 1, '2024-12-10 23:00:00', 1, NULL, 52);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (41, 1, '2024-12-10 23:00:00', 1, NULL, 53);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (42, 1, '2024-12-10 23:00:00', 1, NULL, 54);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (43, 1, '2024-12-10 23:00:00', 1, NULL, 55);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (44, 1, '2024-12-10 23:00:00', 1, NULL, 56);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (45, 1, '2024-12-11 23:00:00', 4, NULL, 57);


--
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.test (id, test) VALUES (1, 'asdasd');
INSERT INTO public.test (id, test) VALUES (2, 'testststst');


--
-- Name: account_accountid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_accountid_seq', 133, true);


--
-- Name: address_addressid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_addressid_seq', 74, true);


--
-- Name: exercise_category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exercise_category_category_id_seq', 10, true);


--
-- Name: exercisetype_exercisetypeid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exercisetype_exercisetypeid_seq', 28, true);


--
-- Name: reservation_reservetionid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_reservetionid_seq', 45, true);


--
-- Name: test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_id_seq', 2, true);


--
-- Name: wrkoutmachine_wrkoutmachineid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wrkoutmachine_wrkoutmachineid_seq', 49, true);


--
-- Name: wrkoutplan_wrkoutplanid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wrkoutplan_wrkoutplanid_seq', 57, true);


--
-- Name: account account_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pk UNIQUE (login);


--
-- Name: account account_pk_2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pk_2 UNIQUE (clerk_id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (account_id);


--
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (address_id);


--
-- Name: exercise_category exercise_category_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_category
    ADD CONSTRAINT exercise_category_pk PRIMARY KEY (category_id);


--
-- Name: exercise_type exercisetype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_type
    ADD CONSTRAINT exercisetype_pkey PRIMARY KEY (exercise_type_id);


--
-- Name: machine_exercise_type machineexercisetypes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machine_exercise_type
    ADD CONSTRAINT machineexercisetypes_pkey PRIMARY KEY (exercise_type_id, machine_id);


--
-- Name: reservation reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_pkey PRIMARY KEY (reservation_id);


--
-- Name: test test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);


--
-- Name: machine wrkoutmachine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machine
    ADD CONSTRAINT wrkoutmachine_pkey PRIMARY KEY (machine_id);


--
-- Name: plan wrkoutplan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan
    ADD CONSTRAINT wrkoutplan_pkey PRIMARY KEY (plan_id);


--
-- Name: plan_machine wrkoutplanmachines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_machine
    ADD CONSTRAINT wrkoutplanmachines_pkey PRIMARY KEY (plan_id, machine_id);


--
-- Name: plan_machine_preset wrkoutplanmachinespreset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_machine_preset
    ADD CONSTRAINT wrkoutplanmachinespreset_pkey PRIMARY KEY (plan_preset_id, machine_id);


--
-- Name: plan_preset wrkoutplanpreset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_preset
    ADD CONSTRAINT wrkoutplanpreset_pkey PRIMARY KEY (plan_preset_id);


--
-- Name: plan_category wrkoutplantype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_category
    ADD CONSTRAINT wrkoutplantype_pkey PRIMARY KEY (plan_id, category_id);


--
-- Name: account account_addressid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_addressid_fkey FOREIGN KEY (address_id) REFERENCES public.address(address_id);


--
-- Name: exercise_type exercise_type_exercise_category_category_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_type
    ADD CONSTRAINT exercise_type_exercise_category_category_id_fk FOREIGN KEY (category_id) REFERENCES public.exercise_category(category_id);


--
-- Name: machine_exercise_type machineexercisetypes_exercisetypeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machine_exercise_type
    ADD CONSTRAINT machineexercisetypes_exercisetypeid_fkey FOREIGN KEY (exercise_type_id) REFERENCES public.exercise_type(exercise_type_id);


--
-- Name: machine_exercise_type machineexercisetypes_wrkoutmachineid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machine_exercise_type
    ADD CONSTRAINT machineexercisetypes_wrkoutmachineid_fkey FOREIGN KEY (machine_id) REFERENCES public.machine(machine_id);


--
-- Name: reservation reservation_customerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_customerid_fkey FOREIGN KEY (customer_id) REFERENCES public.account(account_id);


--
-- Name: reservation reservation_trainerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_trainerid_fkey FOREIGN KEY (trainer_id) REFERENCES public.account(account_id);


--
-- Name: reservation reservation_wrkoutplanid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_wrkoutplanid_fkey FOREIGN KEY (plan_id) REFERENCES public.plan(plan_id);


--
-- Name: plan wrkoutplan_accountid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan
    ADD CONSTRAINT wrkoutplan_accountid_fkey FOREIGN KEY (account_id) REFERENCES public.account(account_id);


--
-- Name: plan_machine wrkoutplanmachines_wrkoutmachineid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_machine
    ADD CONSTRAINT wrkoutplanmachines_wrkoutmachineid_fkey FOREIGN KEY (machine_id) REFERENCES public.machine(machine_id);


--
-- Name: plan_machine wrkoutplanmachines_wrkoutplanid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_machine
    ADD CONSTRAINT wrkoutplanmachines_wrkoutplanid_fkey FOREIGN KEY (plan_id) REFERENCES public.plan(plan_id);


--
-- Name: plan_machine_preset wrkoutplanmachinespreset_wrkoutmachineid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_machine_preset
    ADD CONSTRAINT wrkoutplanmachinespreset_wrkoutmachineid_fkey FOREIGN KEY (machine_id) REFERENCES public.machine(machine_id);


--
-- Name: plan_machine_preset wrkoutplanmachinespreset_wrkoutplanpresetid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_machine_preset
    ADD CONSTRAINT wrkoutplanmachinespreset_wrkoutplanpresetid_fkey FOREIGN KEY (plan_preset_id) REFERENCES public.plan_preset(plan_preset_id);


--
-- Name: plan_preset wrkoutplanpreset_authorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_preset
    ADD CONSTRAINT wrkoutplanpreset_authorid_fkey FOREIGN KEY (author_id) REFERENCES public.account(account_id);


--
-- Name: plan_category wrkoutplantype_exercisetypeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_category
    ADD CONSTRAINT wrkoutplantype_exercisetypeid_fkey FOREIGN KEY (category_id) REFERENCES public.exercise_category(category_id);


--
-- Name: plan_category wrkoutplantype_wrkoutplanid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_category
    ADD CONSTRAINT wrkoutplantype_wrkoutplanid_fkey FOREIGN KEY (plan_id) REFERENCES public.plan(plan_id);


--
-- PostgreSQL database dump complete
--

