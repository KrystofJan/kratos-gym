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

DROP DATABASE IF EXISTS "kratos-gym";
--
-- Name: kratos-gym; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "kratos-gym" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE "kratos-gym" OWNER TO postgres;

\connect -reuse-previous=on "dbname='kratos-gym'"

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

INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (1, 'Admin', 'Admineres', 'admin', 'e', 'krystofjanwastaken@gmail.com', '+420 444 333 222', true, '2025-04-02', '2025-04-02', 1, 0, 'user_2vBMQKvZ44dtMwJcJLbzWXvHdng', 'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ybWNVZmxzaGt4VDFUcEVkSGxhN1lBbk5GaWIiLCJyaWQiOiJ1c2VyXzJ2Qk1RS3ZaNDRkdE13SmNKTGJ6V1h2SGRuZyIsImluaXRpYWxzIjoiQUEifQ');
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (2, 'Trainer', 'Traininsky', 'trainer01', 't', 'krystofjanwastaken+trainer@gmail.com', '+420 112 222 333', true, '2025-04-02', '2025-04-02', 2, 0, 'user_2vBTxjRFkty0qn0w8avZuS1nutT', 'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ybWNVZmxzaGt4VDFUcEVkSGxhN1lBbk5GaWIiLCJyaWQiOiJ1c2VyXzJ2QlR4alJGa3R5MHFuMHc4YXZadVMxbnV0VCIsImluaXRpYWxzIjoiVFQifQ');
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (3, 'Jan', 'Piechotka', 'customer01', 'c', 'krystofjanwastaken+customer1@gmail.com', '+420 123 456 789', true, '2025-04-02', '2025-04-02', 3, 0, 'user_2vBUJRKK0ZYuhdXGkuf5aVZeNpl', 'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ybWNVZmxzaGt4VDFUcEVkSGxhN1lBbk5GaWIiLCJyaWQiOiJ1c2VyXzJ2QlVKUktLMFpZdWhkWEdrdWY1YVZaZU5wbCIsImluaXRpYWxzIjoiSlAifQ');
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (4, 'Inosenc', 'Klesner', 'customer02', 'c', 'krystofjanwastaken+customer2@gmail.com', '+420 999 888 777', true, '2025-04-02', '2025-04-02', 4, 0, 'user_2vBUgXP7uPpkOZ1HOEqUtfAIp9F', 'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ybWNVZmxzaGt4VDFUcEVkSGxhN1lBbk5GaWIiLCJyaWQiOiJ1c2VyXzJ2QlVnWFA3dVBwa09aMUhPRXFVdGZBSXA5RiIsImluaXRpYWxzIjoiSUsifQ');


--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (1, '17. listopadu ', 'Ostrava', '708 00', 'Czech Republic', '2172/15', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (2, 'Na Obleskach', 'Praha', '739 01', 'Czech Republic', '836', '33');
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (3, 'Šalamounova', 'Karlovy Vary', '739 12', 'Czech Republic', '23', NULL);
INSERT INTO public.address (address_id, street, city, postal_code, country, building_number, apartment_number) VALUES (4, 'Malý Koloredov', 'Frýdek-Místek', '738 01', 'Czech Republic', '57', '310');


--
-- Data for Name: exercise_category; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: exercise_type; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: machine; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: machine_exercise_type; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: plan; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: plan_category; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: plan_machine; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: plan_machine_preset; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: plan_preset; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: account_accountid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_accountid_seq', 4, true);


--
-- Name: address_addressid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_addressid_seq', 4, true);


--
-- Name: exercise_category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exercise_category_category_id_seq', 1, false);


--
-- Name: exercisetype_exercisetypeid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exercisetype_exercisetypeid_seq', 1, false);


--
-- Name: reservation_reservetionid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_reservetionid_seq', 1, false);


--
-- Name: test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_id_seq', 1, false);


--
-- Name: wrkoutmachine_wrkoutmachineid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wrkoutmachine_wrkoutmachineid_seq', 1, false);


--
-- Name: wrkoutplan_wrkoutplanid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wrkoutplan_wrkoutplanid_seq', 1, false);


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

