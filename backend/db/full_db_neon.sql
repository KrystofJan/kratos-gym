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
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (6, 'Jonas', 'You', 'popi3', 't', 'killme@pls.com', '+420 324 546 656', true, '2024-09-27', '2024-09-26', 3, 0, 'Ese', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (3, 'Kill', 'You', 'popi', 't', 'killme@pls.com', '+340 291 232 111', true, '2024-09-17', '2024-09-17', 2, 0, 'NAN', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (1, 'Jan-Kryštof', 'Zahradník', 'zahry', 'e', 'jendazah@gmail.com', NULL, true, '2024-09-26', '2024-09-26', 3, 0, 'user_2mcZZtJs0f4vZVWv8qIaqSLsoa4', 'https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybWNaWnR6V05HNjhjbW5UOGlsSzdybGQxN3IifQ&w=1920&q=75');
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (138, 'Test', 'Testovic', 'tistiniseak', 'c', 'testindieak@testniak.com', NULL, true, '2025-02-24', '2025-02-24', 3, 0, 'asdasdasdd', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (140, 'Test', 'Testovic', 'dylan57', 'c', 'paul80@example.net', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '9e0c46b9-6e90-4093-bc71-2c647f58f31a', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (183, 'Test', 'Testovic', 'lynchsusan', 'c', 'martinvanessa@example.net', NULL, false, '2025-02-26', '2025-02-26', 3, 0, '36b28fdd-61e8-42fd-b724-684e6fe80176', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (184, 'Test', 'Testovic', 'berryjonathan', 'c', 'rdavis@example.org', NULL, false, '2025-02-26', '2025-02-26', 3, 0, '8e2420c3-2f0d-4b6a-a469-d4878a105734', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (185, 'Test', 'Testovic', 'danielsmith', 'c', 'jeffreyscott@example.org', NULL, false, '2025-02-26', '2025-02-26', 3, 0, '5d25da04-4fd6-4b77-bc0b-499a65967456', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (186, 'Test', 'Testovic', 'roger09', 'c', 'mcintyrechristopher@example.com', NULL, false, '2025-02-26', '2025-02-26', 3, 0, '36b0e054-0c7d-4c30-8563-d213d7807cf4', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (187, 'Test', 'Testovic', 'jon85', 'c', 'christopher40@example.com', NULL, false, '2025-02-26', '2025-02-26', 3, 0, 'ecaa0e9f-4330-4f11-8f8b-826c3c62d4f3', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (188, 'Test', 'Testovic', 'yzimmerman', 'c', 'royzimmerman@example.org', NULL, false, '2025-02-26', '2025-02-26', 3, 0, '99f8e719-8b39-4f53-ae7b-b12101d5e62d', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (189, 'Test', 'Testovic', 'thompsonjesse', 'c', 'jonesmathew@example.org', NULL, false, '2025-02-26', '2025-02-26', 3, 0, '078126ca-632e-4293-b0ac-1c4078f4a144', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (190, 'Jan', 'Pekelnik', 'admin', 'c', 'jendazah@seznam.cz', NULL, true, '2025-03-03', '2025-03-03', 3, 0, 'user_2toyq2N9hFNLZKDjvoyDi7IGGr6', 'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ybWNVZmxzaGt4VDFUcEVkSGxhN1lBbk5GaWIiLCJyaWQiOiJ1c2VyXzJ0b3lxMk45aEZOTFpLRGp2b3lEaTdJR0dyNiIsImluaXRpYWxzIjoiSlAifQ');
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (4, 'Veles', 'Me', 'popi2', 't', 'killme2@pls.com', '+420 324 546 656', true, '2024-09-17', '2024-09-17', 135, 0, 'Non', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (139, 'Test', 'Testovic', 'brian50', 'c', 'fcarroll@example.com', NULL, true, '2025-02-24', '2025-02-24', 3, 0, 'a23eaedf-4ba1-4ad1-8713-faff5610708a', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (141, 'Test', 'Testovic', 'hoffmanrobert', 'c', 'payala@example.org', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '3a00c4b9-e9c8-4296-ae33-6c7211feba72', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (142, 'Test', 'Testovic', 'rcastillo', 'c', 'tking@example.org', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '1129d718-7385-4c59-acba-59a85a13b1ce', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (143, 'Test', 'Testovic', 'ashley80', 'c', 'friedmanluis@example.org', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '24a94b95-6926-42d2-8ab5-16213cd00af9', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (144, 'Test', 'Testovic', 'michelle99', 'c', 'ybryant@example.org', NULL, true, '2025-02-24', '2025-02-24', 3, 0, 'e6856ff8-b472-410e-b998-c7a8811fea04', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (145, 'Test', 'Testovic', 'obrown', 'c', 'stewarttracy@example.net', NULL, true, '2025-02-24', '2025-02-24', 3, 0, 'cfe37ae2-d182-429b-83a0-4ca0b6aa554a', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (146, 'Test', 'Testovic', 'mccanngregory', 'c', 'alicereeves@example.com', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '7426611f-7503-40b8-80d3-5f9491736361', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (147, 'Test', 'Testovic', 'tchang', 'c', 'erica59@example.org', NULL, true, '2025-02-24', '2025-02-24', 3, 0, 'fe1e5e44-13a4-4afd-b887-70b00e0fce76', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (148, 'Test', 'Testovic', 'crystalsmith', 'c', 'bradfordgabriela@example.org', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '9190e138-0e4b-444d-bdfc-c1f4013a993c', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (149, 'Test', 'Testovic', 'gwendolyn18', 'c', 'bkoch@example.com', NULL, true, '2025-02-24', '2025-02-24', 3, 0, 'ac6a9dde-aac2-4141-a7ad-eced9576c526', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (150, 'Test', 'Testovic', 'jwhite', 'c', 'maymelinda@example.net', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '09110b63-6ce4-450c-8d37-44a7dab7d1de', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (151, 'Test', 'Testovic', 'michaelhoffman', 'c', 'aadams@example.net', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '2ba20b27-99aa-4015-8f23-91edd4e023b9', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (152, 'Test', 'Testovic', 'cruzbarbara', 'c', 'james99@example.com', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '5588fce3-c656-4994-b1d3-7b0065bae067', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (153, 'Test', 'Testovic', 'vickiclay', 'c', 'amanda11@example.org', NULL, true, '2025-02-24', '2025-02-24', 3, 0, 'eac737db-59bc-442f-a81e-d5fa39f22524', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (154, 'Test', 'Testovic', 'cfields', 'c', 'shepardchristine@example.net', NULL, true, '2025-02-24', '2025-02-24', 3, 0, 'add05b15-d722-4833-83f6-d64566338875', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (155, 'Test', 'Testovic', 'brandon09', 'c', 'johnlamb@example.com', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '362c5164-a1ef-4cec-8fae-75637fd68b31', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (156, 'Test', 'Testovic', 'osbornthomas', 'c', 'valexander@example.com', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '32e86593-09a9-4767-9b7e-536f7c116c08', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (157, 'Test', 'Testovic', 'bcarter', 'c', 'amanda43@example.net', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '0c3485d8-2438-4348-869a-7cda58645df4', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (158, 'Test', 'Testovic', 'jonesjill', 'c', 'johnstewart@example.org', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '66ef5e89-dc42-4799-8ccf-09422d824c31', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (159, 'Test', 'Testovic', 'christopherscott', 'c', 'haysmichael@example.com', NULL, true, '2025-02-24', '2025-02-24', 3, 0, '7972b51f-d1b2-497d-8e75-fe967b08c366', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (160, 'Test', 'Testovic', 'elizabeth85', 'c', 'powelljohn@example.org', NULL, true, '2025-02-24', '2025-02-24', 3, 0, 'faa7e4ec-a3d5-4722-8268-e4ff025d421c', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (175, 'Test', 'Testovic', 'randy80', 'c', 'tamarablack@example.org', NULL, true, '2025-02-26', '2025-02-26', 3, 0, '16560eb5-ce9b-407b-bed8-da0060d171e6', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (161, 'Test', 'Testovic', 'codyalvarado', 'c', 'qsolomon@example.com', NULL, true, '2025-02-25', '2025-02-25', 3, 0, '0f6e48e4-4e68-4009-a048-11bacf00b61b', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (164, 'Test', 'Testovic', 'kkeller', 'c', 'vgriffin@example.org', NULL, true, '2025-02-26', '2025-02-26', 3, 0, '9aa79d64-9edb-4c6e-badf-efbaa1f4b44f', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (162, 'Test', 'Testovic', 'ibean', 'c', 'stoneandrew@example.org', NULL, true, '2025-02-26', '2025-02-26', 3, 0, '27308849-c1d7-4ec8-8918-d95671a0436b', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (173, 'Test', 'Testovic', 'amysmith', 'c', 'lkane@example.com', NULL, true, '2025-02-26', '2025-02-26', 3, 0, '168d14d6-6ebb-4755-959b-a7d72c2a9215', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (170, 'Test', 'Testovic', 'barbara58', 'c', 'craig72@example.org', NULL, true, '2025-02-26', '2025-02-26', 3, 0, 'a230624c-3dd9-459b-89b8-1817d84ae630', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (163, 'Test', 'Testovic', 'longamanda', 'c', 'joshua01@example.org', NULL, true, '2025-02-26', '2025-02-26', 3, 0, 'e777836f-8bb8-443e-aff4-7bc22f50587f', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (177, 'Test', 'Testovic', 'mackenzie66', 'c', 'pdavid@example.org', NULL, true, '2025-02-26', '2025-02-26', 3, 0, '697a1c5f-346f-4d0a-9c4a-74bfc85d15ff', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (165, 'Test', 'Testovic', 'wdyer', 'c', 'garciastephen@example.com', NULL, true, '2025-02-26', '2025-02-26', 3, 0, '1e0dd11b-2e6e-4894-92ed-3c26de139bd2', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (171, 'Test', 'Testovic', 'singhann', 'c', 'brownjeremy@example.net', NULL, true, '2025-02-26', '2025-02-26', 3, 0, 'c946f228-7376-4fd7-a20f-8267019de268', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (166, 'Test', 'Testovic', 'irodriguez', 'c', 'hartchristian@example.org', NULL, true, '2025-02-26', '2025-02-26', 3, 0, '8c161d1a-de1b-474c-bbdb-15ab48748a7e', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (174, 'Test', 'Testovic', 'orodriguez', 'c', 'stacey71@example.com', NULL, true, '2025-02-26', '2025-02-26', 3, 0, '68a6a6af-f152-41b4-9e15-c6040649e08a', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (176, 'Test', 'Testovic', 'dblevins', 'c', 'brittanymays@example.com', NULL, true, '2025-02-26', '2025-02-26', 3, 0, 'b627fe94-5334-4517-81b2-050c7cd4d1f5', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (167, 'Test', 'Testovic', 'markjohnson', 'c', 'thompsoncandice@example.net', NULL, true, '2025-02-26', '2025-02-26', 3, 0, '9401e876-178c-4e11-a687-382cfe14f6b9', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (172, 'Test', 'Testovic', 'ryan14', 'c', 'tyronehobbs@example.org', NULL, true, '2025-02-26', '2025-02-26', 3, 0, '28c53341-c3c1-4574-9845-833b0876d32d', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (134, 'Test', 'Testovic', 'tistinieak', 'e', 'testinieak@testniak.com', NULL, true, '2025-02-24', '2025-02-24', 3, 0, 'asdasdasd', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (168, 'Test', 'Testovic', 'tina09', 'c', 'robert19@example.org', NULL, true, '2025-02-26', '2025-02-26', 3, 0, '33622dc0-9e23-4ae6-9d78-8a263b17bae6', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (178, 'Test', 'Testovic', 'christina99', 'c', 'ccastro@example.net', NULL, false, '2025-02-26', '2025-02-26', 3, 0, 'fc988df1-80bc-472d-a365-b4b086eb9546', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (169, 'Test', 'Testovic', 'deannachavez', 'c', 'melanie51@example.com', NULL, true, '2025-02-26', '2025-02-26', 3, 0, '086a0ca3-a5e0-48c9-a50e-cf59cd5aea5b', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (179, 'Test', 'Testovic', 'youngeddie', 'c', 'meganherrera@example.net', NULL, false, '2025-02-26', '2025-02-26', 3, 0, '79ae6231-8ea2-4792-bf85-975b0f41d422', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (180, 'Test', 'Testovic', 'angela52', 'c', 'solomonbarbara@example.net', NULL, false, '2025-02-26', '2025-02-26', 3, 0, '858d4468-7c4e-403c-8da4-d186ccb51d06', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (181, 'Test', 'Testovic', 'wryan', 'c', 'tfowler@example.net', NULL, false, '2025-02-26', '2025-02-26', 3, 0, '325d1824-1357-4b1a-9aa7-793d7c71b315', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (182, 'Test', 'Testovic', 'cole18', 'c', 'lcollins@example.com', NULL, false, '2025-02-26', '2025-02-26', 3, 0, '7062b3cb-9829-465c-9298-0ef196df23bd', NULL);


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
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (70, 'Penas', 'Madrid', '832 12', 'Fuite mala', '231', '21');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (71, 'Duckworth', 'Madrid', '832 29', 'Fuite mala', '22', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (72, 'Puppy', 'Duckworthville', '732 83', 'Fuite mala', '22', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (73, 'Esketit', 'Eksa', 'kjhh', 'ljhkjhkjh', '33', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (74, 'Vedlejsi', 'Ostrava', '734 35', 'CZE', '123/2', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (75, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (76, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (77, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (78, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (79, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (80, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (81, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (82, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (83, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (84, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (85, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (86, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (87, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (88, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (89, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (90, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (91, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (92, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (93, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (94, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (95, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (96, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (97, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (98, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (99, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (100, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (101, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (102, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (103, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (104, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (105, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (106, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (107, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (108, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (1, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (109, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (110, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (111, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (112, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (113, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (114, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (115, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (116, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (117, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (118, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (119, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (120, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (121, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (122, 'Spořilov', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (123, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (124, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (125, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (126, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (127, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (128, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (129, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (130, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (131, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (132, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (133, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (134, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (135, 'Perun', 'Praha', '73292', 'CZE', '832/2', '11');


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
INSERT INTO public.exercise_category (category_id, category_name) VALUES (11, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (12, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (13, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (14, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (15, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (16, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (17, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (18, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (19, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (20, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (21, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (22, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (23, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (24, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (25, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (26, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (27, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (28, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (29, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (31, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (32, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (33, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (34, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (35, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (36, 'Bickules');
INSERT INTO public.exercise_category (category_id, category_name) VALUES (47, 'Radegast');


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
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (29, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (30, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (31, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (32, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (33, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (34, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (35, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (36, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (37, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (38, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (39, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (40, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (41, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (42, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (43, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (44, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (45, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (46, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (47, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (48, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (49, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (50, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (51, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (52, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (53, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (54, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (55, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (56, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (57, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (58, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (59, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (60, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (61, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (62, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (63, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (64, 'Some type', 1, 'Arm');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part) VALUES (65, 'Chernobog', 1, 'Arm');


--
-- Data for Name: machine; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (25, 'Cables', 64, 3, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (3, 'Dumbells', 55, 0.5, 15, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (2, 'Kettle bells', 30, 5, 5, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (1, 'Bench press', 225, 1, 2, 300, 0);
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
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (42, 'Hip Thrust Machine', 250, 20, 1, 300, 75);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (43, 'Multipress Machine', 300, 15, 1, 400, 85);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (44, 'Functional Trainer', 150, 10, 2, 450, 80);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (45, 'Hammer Strength Machine', 300, 15, 1, 400, 88);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (27, 'Leg Press Machine', 400, 30, 4, 300, 85);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (41, 'Vertical Leg Press', 320, 30, 4, 350, 83);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (88, 'Stepping Machine', 0, 0, 1, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (50, 'Stepping Machine', 0, 0, 1, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (51, 'Stepping Machine', 0, 0, 1, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (52, 'Stepping Machine', 0, 0, 1, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (53, 'Stepping Machine', 0, 0, 1, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (54, 'Stepping Machine', 0, 0, 1, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (55, 'Stepping Machine', 0, 0, 1, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (86, 'Stepping Machine', 0, 0, 1, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (87, 'Stepping Machine', 0, 0, 1, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (89, 'Stepping Machine', 0, 0, 1, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (90, 'Stepping Machine', 0, 0, 1, 300, 0);


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
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (58, 'asdfasdf', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (59, 'asdasd', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (191, 'adsfasdf', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (61, 'asdasd', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (62, 'asdasd', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (63, 'asdfasdf', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (193, 'Ad sdjfhds f', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (66, 'asdfasdf', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (67, 'HES BABY KEEM', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (64, 'asdasd', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (65, 'asdasd', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (71, 'TEST-PLAN1233', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (72, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (73, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (74, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (75, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (76, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (77, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (78, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (79, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (80, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (81, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (82, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (83, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (84, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (85, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (86, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (87, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (88, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (89, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (90, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (91, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (92, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (93, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (94, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (95, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (96, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (97, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (98, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (99, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (100, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (101, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (102, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (103, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (104, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (105, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (106, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (107, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (108, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (109, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (110, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (111, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (112, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (113, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (114, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (115, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (116, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (117, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (118, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (119, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (120, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (121, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (122, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (123, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (124, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (125, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (126, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (127, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (128, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (129, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (130, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (131, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (132, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (133, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (134, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (135, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (136, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (137, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (138, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (139, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (140, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (141, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (142, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (143, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (144, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (145, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (146, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (147, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (148, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (149, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (150, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (151, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (152, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (153, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (154, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (155, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (156, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (157, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (158, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (159, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (160, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (161, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (162, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (163, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (164, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (165, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (166, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (167, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (168, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (169, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (170, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (171, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (172, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (173, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (174, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (175, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (176, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (177, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (178, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (179, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (180, 'TEST-PLAN1233', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (181, 'Bielobog', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (182, 'Esketit', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (183, 'Ekesd', 128);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (184, 'aasdfsd', 128);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (185, 'dsdfsdf', 128);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (186, 'asdfasdf', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (187, 'Reservation 1', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (188, 'asdasd', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (189, 'iuhokjh', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (190, 'sdfsdf', 1);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (192, 'klksjdfjdsfg', 1);


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
INSERT INTO public.plan_category (plan_id, category_id) VALUES (58, 4);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (59, 3);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (63, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (66, 4);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (67, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (191, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (192, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (193, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (75, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (77, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (79, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (81, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (83, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (85, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (87, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (89, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (91, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (93, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (95, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (97, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (99, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (101, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (103, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (105, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (107, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (109, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (111, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (113, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (115, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (117, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (119, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (121, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (123, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (125, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (127, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (129, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (131, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (133, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (135, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (137, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (139, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (141, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (143, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (145, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (147, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (149, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (151, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (153, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (155, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (157, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (159, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (161, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (163, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (165, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (167, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (169, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (171, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (173, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (175, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (177, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (179, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (181, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (182, 1);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (183, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (184, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (185, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (186, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (187, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (188, 3);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (189, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (190, 2);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (190, 6);
INSERT INTO public.plan_category (plan_id, category_id) VALUES (190, 3);


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
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (49, 25, 4, 8, '10:15:00', '10:25:00', true);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (54, 25, 4, 6, '00:00:00', '00:00:00', true);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (57, 25, 4, 4, '10:15:00', '10:20:00', true);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (191, 25, 4, 6, '00:10:00', '00:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (191, 29, 4, 6, '00:15:00', '00:20:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (48, 25, 4, 5, '10:13:00', '10:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (58, 25, 4, 6, '00:00:00', '01:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (58, 30, 4, 6, '01:00:00', '02:00:00', true);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (58, 36, 4, 6, '02:00:00', '03:00:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (59, 25, 4, 6, '00:00:00', '00:01:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (63, 39, 4, 6, '00:00:00', '00:04:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (63, 35, 4, 6, '00:04:00', '00:09:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (63, 31, 4, 6, '00:09:00', '00:13:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (66, 25, 4, 6, '00:01:00', '00:06:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (66, 28, 4, 6, '00:06:00', '00:13:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (66, 32, 4, 6, '00:13:00', '00:18:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (67, 25, 4, 6, '00:01:00', '00:06:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (67, 30, 4, 6, '00:06:00', '00:11:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (67, 36, 4, 6, '00:11:00', '00:16:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (191, 34, 4, 6, '00:20:00', '00:26:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (191, 39, 4, 6, '00:26:00', '00:32:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (191, 45, 4, 6, '00:32:00', '00:36:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (191, 3, 4, 6, '00:36:00', '00:42:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (75, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (75, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (75, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (77, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (77, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (77, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (79, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (79, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (79, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (81, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (81, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (81, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (83, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (83, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (83, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (85, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (85, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (85, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (87, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (87, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (87, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (89, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (89, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (89, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (91, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (91, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (91, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (93, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (93, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (93, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (95, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (95, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (95, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (97, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (97, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (97, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (99, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (99, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (99, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (101, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (101, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (101, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (103, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (103, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (103, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (105, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (105, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (105, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (107, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (107, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (107, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (109, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (109, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (109, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (111, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (111, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (111, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (113, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (113, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (113, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (115, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (115, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (115, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (117, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (117, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (117, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (119, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (119, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (119, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (121, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (121, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (121, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (123, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (123, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (123, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (125, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (125, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (125, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (127, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (127, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (127, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (129, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (129, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (129, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (131, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (131, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (131, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (133, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (133, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (133, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (135, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (135, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (135, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (137, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (137, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (137, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (139, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (139, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (139, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (141, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (141, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (141, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (143, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (143, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (143, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (145, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (145, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (145, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (147, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (147, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (147, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (149, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (149, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (149, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (151, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (151, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (151, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (153, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (153, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (153, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (155, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (155, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (155, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (157, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (157, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (157, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (159, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (159, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (159, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (161, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (161, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (161, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (163, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (163, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (163, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (165, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (165, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (165, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (167, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (167, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (167, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (169, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (169, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (169, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (171, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (171, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (171, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (173, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (173, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (173, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (175, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (175, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (175, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (177, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (177, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (177, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (179, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (179, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (179, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (181, 25, 4, 6, '09:00:00', '09:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (181, 30, 4, 6, '09:05:00', '09:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (181, 36, 4, 6, '09:10:00', '09:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (182, 25, 4, 6, '00:00:00', '00:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (182, 30, 4, 6, '00:05:00', '00:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (182, 36, 4, 6, '00:10:00', '00:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (183, 25, 4, 6, '00:00:00', '00:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (183, 30, 4, 6, '00:05:00', '00:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (183, 36, 4, 6, '00:10:00', '00:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (184, 25, 4, 6, '00:00:00', '00:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (184, 1, 4, 6, '00:00:00', '00:06:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (184, 30, 4, 6, '00:00:00', '00:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (185, 25, 4, 6, '00:00:00', '00:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (185, 1, 4, 6, '00:05:00', '00:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (185, 30, 4, 6, '00:10:00', '00:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (186, 25, 4, 6, '00:00:00', '00:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (186, 1, 4, 6, '00:05:00', '00:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (186, 30, 4, 6, '00:10:00', '00:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (187, 25, 4, 6, '00:00:00', '00:05:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (187, 30, 4, 6, '00:05:00', '00:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (187, 36, 4, 6, '00:10:00', '00:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (188, 25, 4, 6, '00:00:00', '00:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (189, 25, 4, 6, '00:05:00', '00:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (189, 29, 4, 6, '00:10:00', '00:16:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (189, 34, 4, 6, '00:16:00', '00:22:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (190, 25, 4, 6, '00:05:00', '00:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (190, 30, 4, 6, '00:10:00', '00:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (190, 36, 4, 6, '00:15:00', '00:20:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (191, 30, 4, 6, '00:42:00', '00:47:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (191, 35, 4, 6, '00:47:00', '00:52:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (191, 40, 4, 6, '00:52:00', '00:57:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (192, 25, 4, 6, '00:05:00', '00:10:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (192, 29, 4, 6, '00:10:00', '00:16:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (192, 34, 4, 6, '00:16:00', '00:22:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (193, 30, 4, 6, '00:10:00', '00:15:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (193, 25, 4, 6, '00:15:00', '00:20:00', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (193, 36, 4, 6, '00:20:00', '00:25:00', false);


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
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (44, 1, '2024-12-10 23:00:00', 1, NULL, 56);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (45, 1, '2024-12-11 23:00:00', 4, NULL, 57);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (26, 2, '2024-12-12 23:00:00', 1, NULL, 33);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (46, 1, '2025-02-18 23:00:00', 1, NULL, 58);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (47, 1, '2025-02-19 23:00:00', 1, NULL, 59);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (179, 1, '2025-03-28 00:00:00', 1, NULL, 193);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (49, 1, '2025-02-26 23:00:00', 1, NULL, 61);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (50, 1, '2025-02-26 23:00:00', 1, NULL, 62);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (51, 1, '2025-02-25 23:00:00', 1, NULL, 63);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (52, 1, '2025-02-18 23:00:00', 1, NULL, 66);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (53, 1, '2025-02-18 23:00:00', 1, NULL, 67);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (57, 1, '2023-10-01 00:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (58, 2, '2025-02-23 23:00:00', 1, NULL, 75);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (60, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (61, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (62, 2, '2025-02-23 23:00:00', 1, NULL, 77);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (63, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (64, 2, '2025-02-23 23:00:00', 1, NULL, 79);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (65, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (66, 2, '2025-02-23 23:00:00', 1, NULL, 81);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (67, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (68, 2, '2025-02-23 23:00:00', 1, NULL, 83);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (69, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (70, 2, '2025-02-23 23:00:00', 1, NULL, 85);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (71, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (72, 2, '2025-02-23 23:00:00', 1, NULL, 87);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (73, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (74, 2, '2025-02-23 23:00:00', 1, NULL, 89);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (75, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (76, 2, '2025-02-23 23:00:00', 1, NULL, 91);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (77, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (78, 2, '2025-02-23 23:00:00', 1, NULL, 93);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (79, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (80, 2, '2025-02-23 23:00:00', 1, NULL, 95);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (81, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (82, 2, '2025-02-23 23:00:00', 1, NULL, 97);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (83, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (84, 2, '2025-02-23 23:00:00', 1, NULL, 99);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (85, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (86, 2, '2025-02-23 23:00:00', 1, NULL, 101);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (87, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (88, 2, '2025-02-23 23:00:00', 1, NULL, 103);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (89, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (90, 2, '2025-02-23 23:00:00', 1, NULL, 105);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (91, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (92, 2, '2025-02-23 23:00:00', 1, NULL, 107);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (93, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (94, 2, '2025-02-23 23:00:00', 1, NULL, 109);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (95, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (96, 2, '2025-02-23 23:00:00', 1, NULL, 111);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (97, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (98, 2, '2025-02-23 23:00:00', 1, NULL, 113);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (99, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (100, 2, '2025-02-23 23:00:00', 1, NULL, 115);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (101, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (102, 2, '2025-02-23 23:00:00', 1, NULL, 117);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (103, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (104, 2, '2025-02-23 23:00:00', 1, NULL, 119);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (105, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (106, 2, '2025-02-23 23:00:00', 1, NULL, 121);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (107, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (108, 2, '2025-02-23 23:00:00', 1, NULL, 123);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (109, 1, '2023-10-01 00:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (110, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (111, 2, '2025-02-23 23:00:00', 1, NULL, 125);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (112, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (113, 2, '2025-02-23 23:00:00', 1, NULL, 127);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (114, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (115, 2, '2025-02-23 23:00:00', 1, NULL, 129);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (116, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (117, 2, '2025-02-23 23:00:00', 1, NULL, 131);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (118, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (119, 2, '2025-02-23 23:00:00', 1, NULL, 133);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (120, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (121, 2, '2025-02-23 23:00:00', 1, NULL, 135);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (122, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (123, 2, '2025-02-23 23:00:00', 1, NULL, 137);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (124, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (125, 2, '2025-02-23 23:00:00', 1, NULL, 139);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (126, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (127, 2, '2025-02-23 23:00:00', 1, NULL, 141);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (128, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (129, 2, '2025-02-23 23:00:00', 1, NULL, 143);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (130, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (131, 2, '2025-02-23 23:00:00', 1, NULL, 145);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (132, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (133, 2, '2025-02-23 23:00:00', 1, NULL, 147);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (134, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (135, 2, '2025-02-23 23:00:00', 1, NULL, 149);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (136, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (137, 2, '2025-02-23 23:00:00', 1, NULL, 151);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (138, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (139, 2, '2025-02-23 23:00:00', 1, NULL, 153);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (140, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (141, 2, '2025-02-23 23:00:00', 1, NULL, 155);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (142, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (143, 2, '2025-02-23 23:00:00', 1, NULL, 157);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (144, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (146, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (148, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (150, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (152, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (154, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (156, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (158, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (160, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (162, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (164, 1, '2023-10-01 08:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (178, 1, '2025-03-28 00:00:00', 1, NULL, 192);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (166, 1, '2023-10-01 10:00:00', 1, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (168, 1, '2025-03-27 23:00:00', 1, NULL, 182);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (169, 1, '2025-03-27 23:00:00', 128, NULL, 183);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (170, 1, '2025-03-27 23:00:00', 128, NULL, 184);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (171, 1, '2025-03-28 00:00:00', 128, NULL, 185);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (176, 1, '2025-03-27 00:00:00', 1, NULL, 190);


--
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.test (id, test) VALUES (1, 'asdasd');
INSERT INTO public.test (id, test) VALUES (2, 'testststst');


--
-- Name: account_accountid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_accountid_seq', 191, true);


--
-- Name: address_addressid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_addressid_seq', 135, true);


--
-- Name: exercise_category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exercise_category_category_id_seq', 59, true);


--
-- Name: exercisetype_exercisetypeid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exercisetype_exercisetypeid_seq', 77, true);


--
-- Name: reservation_reservetionid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_reservetionid_seq', 179, true);


--
-- Name: test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_id_seq', 2, true);


--
-- Name: wrkoutmachine_wrkoutmachineid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wrkoutmachine_wrkoutmachineid_seq', 102, true);


--
-- Name: wrkoutplan_wrkoutplanid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wrkoutplan_wrkoutplanid_seq', 193, true);


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

