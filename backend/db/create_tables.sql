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

DROP DATABASE IF EXISTS "kratos-dev";
--
-- Name: kratos-dev; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "kratos-dev" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE "kratos-dev" OWNER TO postgres;

\connect -reuse-previous=on "dbname='kratos-dev'"

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
-- name: account account_pk; type: constraint; schema: public; owner: postgres
--

alter table only public.account
    add constraint account_pk unique (login);


--
-- name: account account_pk_2; type: constraint; schema: public; owner: postgres
--

alter table only public.account
    add constraint account_pk_2 unique (clerk_id);


--
-- name: account account_pkey; type: constraint; schema: public; owner: postgres
--

alter table only public.account
    add constraint account_pkey primary key (account_id);


--
-- name: address address_pkey; type: constraint; schema: public; owner: postgres
--

alter table only public.address
    add constraint address_pkey primary key (address_id);


--
-- name: exercise_category exercise_category_pk; type: constraint; schema: public; owner: postgres
--

alter table only public.exercise_category
    add constraint exercise_category_pk primary key (category_id);


--
-- name: exercise_type exercisetype_pkey; type: constraint; schema: public; owner: postgres
--

alter table only public.exercise_type
    add constraint exercisetype_pkey primary key (exercise_type_id);


--
-- name: machine_exercise_type machineexercisetypes_pkey; type: constraint; schema: public; owner: postgres
--

alter table only public.machine_exercise_type
    add constraint machineexercisetypes_pkey primary key (exercise_type_id, machine_id);


--
-- name: reservation reservation_pkey; type: constraint; schema: public; owner: postgres
--

alter table only public.reservation
    add constraint reservation_pkey primary key (reservation_id);


--
-- name: test test_pkey; type: constraint; schema: public; owner: postgres
--

alter table only public.test
    add constraint test_pkey primary key (id);


--
-- name: machine wrkoutmachine_pkey; type: constraint; schema: public; owner: postgres
--

alter table only public.machine
    add constraint wrkoutmachine_pkey primary key (machine_id);


--
-- name: plan wrkoutplan_pkey; type: constraint; schema: public; owner: postgres
--

alter table only public.plan
    add constraint wrkoutplan_pkey primary key (plan_id);


--
-- name: plan_machine wrkoutplanmachines_pkey; type: constraint; schema: public; owner: postgres
--

alter table only public.plan_machine
    add constraint wrkoutplanmachines_pkey primary key (plan_id, machine_id);


--
-- name: plan_machine_preset wrkoutplanmachinespreset_pkey; type: constraint; schema: public; owner: postgres
--

alter table only public.plan_machine_preset
    add constraint wrkoutplanmachinespreset_pkey primary key (plan_preset_id, machine_id);


--
-- name: plan_preset wrkoutplanpreset_pkey; type: constraint; schema: public; owner: postgres
--

alter table only public.plan_preset
    add constraint wrkoutplanpreset_pkey primary key (plan_preset_id);


--
-- name: plan_category wrkoutplantype_pkey; type: constraint; schema: public; owner: postgres
--

alter table only public.plan_category
    add constraint wrkoutplantype_pkey primary key (plan_id, category_id);


--
-- name: account account_addressid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.account
    add constraint account_addressid_fkey foreign key (address_id) references public.address(address_id);


--
-- name: exercise_type exercise_type_exercise_category_category_id_fk; type: fk constraint; schema: public; owner: postgres
--

alter table only public.exercise_type
    add constraint exercise_type_exercise_category_category_id_fk foreign key (category_id) references public.exercise_category(category_id);


--
-- name: machine_exercise_type machineexercisetypes_exercisetypeid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.machine_exercise_type
    add constraint machineexercisetypes_exercisetypeid_fkey foreign key (exercise_type_id) references public.exercise_type(exercise_type_id);


--
-- name: machine_exercise_type machineexercisetypes_wrkoutmachineid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.machine_exercise_type
    add constraint machineexercisetypes_wrkoutmachineid_fkey foreign key (machine_id) references public.machine(machine_id);


--
-- name: reservation reservation_customerid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.reservation
    add constraint reservation_customerid_fkey foreign key (customer_id) references public.account(account_id);


--
-- name: reservation reservation_trainerid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.reservation
    add constraint reservation_trainerid_fkey foreign key (trainer_id) references public.account(account_id);


--
-- name: reservation reservation_wrkoutplanid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.reservation
    add constraint reservation_wrkoutplanid_fkey foreign key (plan_id) references public.plan(plan_id);


--
-- name: plan wrkoutplan_accountid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.plan
    add constraint wrkoutplan_accountid_fkey foreign key (account_id) references public.account(account_id);


--
-- name: plan_machine wrkoutplanmachines_wrkoutmachineid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.plan_machine
    add constraint wrkoutplanmachines_wrkoutmachineid_fkey foreign key (machine_id) references public.machine(machine_id);


--
-- name: plan_machine wrkoutplanmachines_wrkoutplanid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.plan_machine
    add constraint wrkoutplanmachines_wrkoutplanid_fkey foreign key (plan_id) references public.plan(plan_id);


--
-- name: plan_machine_preset wrkoutplanmachinespreset_wrkoutmachineid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.plan_machine_preset
    add constraint wrkoutplanmachinespreset_wrkoutmachineid_fkey foreign key (machine_id) references public.machine(machine_id);


--
-- name: plan_machine_preset wrkoutplanmachinespreset_wrkoutplanpresetid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.plan_machine_preset
    add constraint wrkoutplanmachinespreset_wrkoutplanpresetid_fkey foreign key (plan_preset_id) references public.plan_preset(plan_preset_id);


--
-- name: plan_preset wrkoutplanpreset_authorid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.plan_preset
    add constraint wrkoutplanpreset_authorid_fkey foreign key (author_id) references public.account(account_id);


--
-- name: plan_category wrkoutplantype_exercisetypeid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.plan_category
    add constraint wrkoutplantype_exercisetypeid_fkey foreign key (category_id) references public.exercise_category(category_id);


--
-- name: plan_category wrkoutplantype_wrkoutplanid_fkey; type: fk constraint; schema: public; owner: postgres
--

alter table only public.plan_category
    add constraint wrkoutplantype_wrkoutplanid_fkey foreign key (plan_id) references public.plan(plan_id);
--
-- postgresql database dump complete
--
