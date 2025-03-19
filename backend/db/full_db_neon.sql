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

COPY public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) FROM stdin;
133	Jan	Zahradnik	profiq	c	jan.zahradnik@profiq.com	\N	t	2024-10-19	2024-10-19	73	0	user_2neSG9S1XrTx86YhJWhApLE0Q3S	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybmVTRzgxakgxbW1Rd3RtUDJteVdkTGdZcFMifQ
128	Jan-Kryštof	Zahradník	testoros	c	krystofjanwastaken@gmail.com	\N	t	2024-10-12	2024-10-12	69	0	user_2nKTn6uRFJEFDY8cKgXxU6IJVwk	https://preview.redd.it/new-profile-pictures-for-yall-v0-brdjms2xte3c1.jpg?width=720&format=pjpg&auto=webp&s=ee4dd7a6b958c218987219c7ba5311424d2a3345
6	Jonas	You	popi3	t	killme@pls.com	+420 324 546 656	t	2024-09-27	2024-09-26	3	0	Ese	\N
3	Kill	You	popi	t	killme@pls.com	+340 291 232 111	t	2024-09-17	2024-09-17	2	0	NAN	\N
1	Jan-Kryštof	Zahradník	zahry	e	jendazah@gmail.com	\N	t	2024-09-26	2024-09-26	3	0	user_2mcZZtJs0f4vZVWv8qIaqSLsoa4	https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybWNaWnR6V05HNjhjbW5UOGlsSzdybGQxN3IifQ&w=1920&q=75
138	Test	Testovic	tistiniseak	c	testindieak@testniak.com	\N	t	2025-02-24	2025-02-24	3	0	asdasdasdd	\N
140	Test	Testovic	dylan57	c	paul80@example.net	\N	t	2025-02-24	2025-02-24	3	0	9e0c46b9-6e90-4093-bc71-2c647f58f31a	\N
183	Test	Testovic	lynchsusan	c	martinvanessa@example.net	\N	f	2025-02-26	2025-02-26	3	0	36b28fdd-61e8-42fd-b724-684e6fe80176	\N
184	Test	Testovic	berryjonathan	c	rdavis@example.org	\N	f	2025-02-26	2025-02-26	3	0	8e2420c3-2f0d-4b6a-a469-d4878a105734	\N
185	Test	Testovic	danielsmith	c	jeffreyscott@example.org	\N	f	2025-02-26	2025-02-26	3	0	5d25da04-4fd6-4b77-bc0b-499a65967456	\N
186	Test	Testovic	roger09	c	mcintyrechristopher@example.com	\N	f	2025-02-26	2025-02-26	3	0	36b0e054-0c7d-4c30-8563-d213d7807cf4	\N
187	Test	Testovic	jon85	c	christopher40@example.com	\N	f	2025-02-26	2025-02-26	3	0	ecaa0e9f-4330-4f11-8f8b-826c3c62d4f3	\N
188	Test	Testovic	yzimmerman	c	royzimmerman@example.org	\N	f	2025-02-26	2025-02-26	3	0	99f8e719-8b39-4f53-ae7b-b12101d5e62d	\N
189	Test	Testovic	thompsonjesse	c	jonesmathew@example.org	\N	f	2025-02-26	2025-02-26	3	0	078126ca-632e-4293-b0ac-1c4078f4a144	\N
190	Jan	Pekelnik	admin	c	jendazah@seznam.cz	\N	t	2025-03-03	2025-03-03	3	0	user_2toyq2N9hFNLZKDjvoyDi7IGGr6	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ybWNVZmxzaGt4VDFUcEVkSGxhN1lBbk5GaWIiLCJyaWQiOiJ1c2VyXzJ0b3lxMk45aEZOTFpLRGp2b3lEaTdJR0dyNiIsImluaXRpYWxzIjoiSlAifQ
4	Veles	Me	popi2	t	killme2@pls.com	+420 324 546 656	t	2024-09-17	2024-09-17	135	0	Non	\N
139	Test	Testovic	brian50	c	fcarroll@example.com	\N	t	2025-02-24	2025-02-24	3	0	a23eaedf-4ba1-4ad1-8713-faff5610708a	\N
141	Test	Testovic	hoffmanrobert	c	payala@example.org	\N	t	2025-02-24	2025-02-24	3	0	3a00c4b9-e9c8-4296-ae33-6c7211feba72	\N
142	Test	Testovic	rcastillo	c	tking@example.org	\N	t	2025-02-24	2025-02-24	3	0	1129d718-7385-4c59-acba-59a85a13b1ce	\N
143	Test	Testovic	ashley80	c	friedmanluis@example.org	\N	t	2025-02-24	2025-02-24	3	0	24a94b95-6926-42d2-8ab5-16213cd00af9	\N
144	Test	Testovic	michelle99	c	ybryant@example.org	\N	t	2025-02-24	2025-02-24	3	0	e6856ff8-b472-410e-b998-c7a8811fea04	\N
145	Test	Testovic	obrown	c	stewarttracy@example.net	\N	t	2025-02-24	2025-02-24	3	0	cfe37ae2-d182-429b-83a0-4ca0b6aa554a	\N
146	Test	Testovic	mccanngregory	c	alicereeves@example.com	\N	t	2025-02-24	2025-02-24	3	0	7426611f-7503-40b8-80d3-5f9491736361	\N
147	Test	Testovic	tchang	c	erica59@example.org	\N	t	2025-02-24	2025-02-24	3	0	fe1e5e44-13a4-4afd-b887-70b00e0fce76	\N
148	Test	Testovic	crystalsmith	c	bradfordgabriela@example.org	\N	t	2025-02-24	2025-02-24	3	0	9190e138-0e4b-444d-bdfc-c1f4013a993c	\N
149	Test	Testovic	gwendolyn18	c	bkoch@example.com	\N	t	2025-02-24	2025-02-24	3	0	ac6a9dde-aac2-4141-a7ad-eced9576c526	\N
150	Test	Testovic	jwhite	c	maymelinda@example.net	\N	t	2025-02-24	2025-02-24	3	0	09110b63-6ce4-450c-8d37-44a7dab7d1de	\N
151	Test	Testovic	michaelhoffman	c	aadams@example.net	\N	t	2025-02-24	2025-02-24	3	0	2ba20b27-99aa-4015-8f23-91edd4e023b9	\N
152	Test	Testovic	cruzbarbara	c	james99@example.com	\N	t	2025-02-24	2025-02-24	3	0	5588fce3-c656-4994-b1d3-7b0065bae067	\N
153	Test	Testovic	vickiclay	c	amanda11@example.org	\N	t	2025-02-24	2025-02-24	3	0	eac737db-59bc-442f-a81e-d5fa39f22524	\N
154	Test	Testovic	cfields	c	shepardchristine@example.net	\N	t	2025-02-24	2025-02-24	3	0	add05b15-d722-4833-83f6-d64566338875	\N
155	Test	Testovic	brandon09	c	johnlamb@example.com	\N	t	2025-02-24	2025-02-24	3	0	362c5164-a1ef-4cec-8fae-75637fd68b31	\N
156	Test	Testovic	osbornthomas	c	valexander@example.com	\N	t	2025-02-24	2025-02-24	3	0	32e86593-09a9-4767-9b7e-536f7c116c08	\N
157	Test	Testovic	bcarter	c	amanda43@example.net	\N	t	2025-02-24	2025-02-24	3	0	0c3485d8-2438-4348-869a-7cda58645df4	\N
158	Test	Testovic	jonesjill	c	johnstewart@example.org	\N	t	2025-02-24	2025-02-24	3	0	66ef5e89-dc42-4799-8ccf-09422d824c31	\N
159	Test	Testovic	christopherscott	c	haysmichael@example.com	\N	t	2025-02-24	2025-02-24	3	0	7972b51f-d1b2-497d-8e75-fe967b08c366	\N
160	Test	Testovic	elizabeth85	c	powelljohn@example.org	\N	t	2025-02-24	2025-02-24	3	0	faa7e4ec-a3d5-4722-8268-e4ff025d421c	\N
175	Test	Testovic	randy80	c	tamarablack@example.org	\N	t	2025-02-26	2025-02-26	3	0	16560eb5-ce9b-407b-bed8-da0060d171e6	\N
161	Test	Testovic	codyalvarado	c	qsolomon@example.com	\N	t	2025-02-25	2025-02-25	3	0	0f6e48e4-4e68-4009-a048-11bacf00b61b	\N
164	Test	Testovic	kkeller	c	vgriffin@example.org	\N	t	2025-02-26	2025-02-26	3	0	9aa79d64-9edb-4c6e-badf-efbaa1f4b44f	\N
162	Test	Testovic	ibean	c	stoneandrew@example.org	\N	t	2025-02-26	2025-02-26	3	0	27308849-c1d7-4ec8-8918-d95671a0436b	\N
173	Test	Testovic	amysmith	c	lkane@example.com	\N	t	2025-02-26	2025-02-26	3	0	168d14d6-6ebb-4755-959b-a7d72c2a9215	\N
170	Test	Testovic	barbara58	c	craig72@example.org	\N	t	2025-02-26	2025-02-26	3	0	a230624c-3dd9-459b-89b8-1817d84ae630	\N
163	Test	Testovic	longamanda	c	joshua01@example.org	\N	t	2025-02-26	2025-02-26	3	0	e777836f-8bb8-443e-aff4-7bc22f50587f	\N
177	Test	Testovic	mackenzie66	c	pdavid@example.org	\N	t	2025-02-26	2025-02-26	3	0	697a1c5f-346f-4d0a-9c4a-74bfc85d15ff	\N
165	Test	Testovic	wdyer	c	garciastephen@example.com	\N	t	2025-02-26	2025-02-26	3	0	1e0dd11b-2e6e-4894-92ed-3c26de139bd2	\N
171	Test	Testovic	singhann	c	brownjeremy@example.net	\N	t	2025-02-26	2025-02-26	3	0	c946f228-7376-4fd7-a20f-8267019de268	\N
166	Test	Testovic	irodriguez	c	hartchristian@example.org	\N	t	2025-02-26	2025-02-26	3	0	8c161d1a-de1b-474c-bbdb-15ab48748a7e	\N
174	Test	Testovic	orodriguez	c	stacey71@example.com	\N	t	2025-02-26	2025-02-26	3	0	68a6a6af-f152-41b4-9e15-c6040649e08a	\N
176	Test	Testovic	dblevins	c	brittanymays@example.com	\N	t	2025-02-26	2025-02-26	3	0	b627fe94-5334-4517-81b2-050c7cd4d1f5	\N
167	Test	Testovic	markjohnson	c	thompsoncandice@example.net	\N	t	2025-02-26	2025-02-26	3	0	9401e876-178c-4e11-a687-382cfe14f6b9	\N
172	Test	Testovic	ryan14	c	tyronehobbs@example.org	\N	t	2025-02-26	2025-02-26	3	0	28c53341-c3c1-4574-9845-833b0876d32d	\N
134	Test	Testovic	tistinieak	e	testinieak@testniak.com	\N	t	2025-02-24	2025-02-24	3	0	asdasdasd	\N
168	Test	Testovic	tina09	c	robert19@example.org	\N	t	2025-02-26	2025-02-26	3	0	33622dc0-9e23-4ae6-9d78-8a263b17bae6	\N
178	Test	Testovic	christina99	c	ccastro@example.net	\N	f	2025-02-26	2025-02-26	3	0	fc988df1-80bc-472d-a365-b4b086eb9546	\N
169	Test	Testovic	deannachavez	c	melanie51@example.com	\N	t	2025-02-26	2025-02-26	3	0	086a0ca3-a5e0-48c9-a50e-cf59cd5aea5b	\N
179	Test	Testovic	youngeddie	c	meganherrera@example.net	\N	f	2025-02-26	2025-02-26	3	0	79ae6231-8ea2-4792-bf85-975b0f41d422	\N
180	Test	Testovic	angela52	c	solomonbarbara@example.net	\N	f	2025-02-26	2025-02-26	3	0	858d4468-7c4e-403c-8da4-d186ccb51d06	\N
181	Test	Testovic	wryan	c	tfowler@example.net	\N	f	2025-02-26	2025-02-26	3	0	325d1824-1357-4b1a-9aa7-793d7c71b315	\N
182	Test	Testovic	cole18	c	lcollins@example.com	\N	f	2025-02-26	2025-02-26	3	0	7062b3cb-9829-465c-9298-0ef196df23bd	\N
\.


--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.address (address_id, street, city, postal_code, country, building_number, apartment_number) FROM stdin;
3	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
5	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
7	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
8	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
9	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
10	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
11	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
12	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
13	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
14	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
15	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
16	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
17	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
18	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
19	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
20	Spořilov	Praha	73292	CZE	832/2	11
21	Spořilov	Praha	73292	CZE	832/2	11
22	Spořilov	Praha	73292	CZE	832/2	11
23	Spořilov	Praha	73292	CZE	832/2	11
24	Spořilov	Praha	73292	CZE	832/2	11
25	Spořilov	Praha	73292	CZE	832/2	11
27	Spořilov	Praha	73292	CZE	832/2	11
28	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	\N
29	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
30	Spořilov	Praha	73292	CZE	832/2	11
31	Spořilov	Praha	73292	CZE	832/2	11
32	Spořilov	Praha	73292	CZE	832/2	11
33	Spořilov	Praha	73292	CZE	832/2	11
34	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
35	Vedlejsi	Ostrava	734 35	CZE	123/2	\N
36	Spořilov	Praha	73292	CZE	832/2	11
37	Spořilov	Praha	73292	CZE	832/2	\N
38	Spořilov	Praha	73292	CZE	832/2	\N
40	Spořilov	Praha	73292	CZE	832/2	11
41	Hlavní třída	Frýdek-Místek	734 34	CZE	123/2	32A
42	jk	jk	jk	Posad	jk	kj
43	test	test	test	test	test	test
44	asd	hjl	kj	Esketit	lkj	lkj
45	kjh	kjh	kjh	jkh	jkh	kjh
46	kjh	kjh	kjh	jkh	jkh	kjh
47	hkj	hjk	hk	eshjkh	jhkjh	jkh
48	kjh	kjh	kjh	kjh	kjh	kjh
49	hk	hkj	hkj	hkj	hkj	hjkh
50	eksad	jklj	lkj	esketit	lkj	lkjlkj
51						
52						
54	Streetus	Maximus	ApartmentNumber	More	qApartmentNumber	ApartmentNumber
2	Vedlejší třída	Profiq	839 23	Profiq	2323	32
55	Streetus maximus	Citius minimus	839 92	Ormus	22	33
56	Streetus maximus	Citius minimus	839 92	Ormus	22	33
57	esketit	kl	kjl	jl	kj	lkjlkj
58	ghjhg	jhg	jhg	jhg	jhg	jhgj
59	hkj	hkjh	kj	kjh	hkj	hkjh
60	hk	jhjk	hkj	hkj	hk	jhjk
61	hk	jhjk	hkj	hkj	hk	jhjk
62	kasdasd	klj	jkl	hkjlh	hkjl	hkljh
63	kkljh	lkjhljkh	lkjh	lkjh	lkjh	ljkhlkjhlkjh
64	laskjdlkasjdkl	kjhkj	hjk	hjk	hkj	hkjhjkh
65	Streetus	Maximus	323 03	Gigantus	32	33
66	Golem	Golem	434	Golem	434	999
67	Streetus maximus	Citium minumus	828 91	Esketit	32	dd
68	Esketit	Esketit	832 83	Esketit	asd	asdasd
69	hjljlkj	lkj	lkj	lkj	kljkljllkj	lkj
70	Penas	Madrid	832 12	Fuite mala	231	21
71	Duckworth	Madrid	832 29	Fuite mala	22	\N
72	Puppy	Duckworthville	732 83	Fuite mala	22	\N
73	Esketit	Eksa	kjhh	ljhkjhkjh	33	\N
74	Vedlejsi	Ostrava	734 35	CZE	123/2	\N
75	Spořilov	Praha	73292	CZE	832/2	11
76	Spořilov	Praha	73292	CZE	832/2	11
77	Spořilov	Praha	73292	CZE	832/2	11
78	Spořilov	Praha	73292	CZE	832/2	11
79	Spořilov	Praha	73292	CZE	832/2	11
80	Spořilov	Praha	73292	CZE	832/2	11
81	Spořilov	Praha	73292	CZE	832/2	11
82	Spořilov	Praha	73292	CZE	832/2	11
83	Spořilov	Praha	73292	CZE	832/2	11
84	Spořilov	Praha	73292	CZE	832/2	11
85	Spořilov	Praha	73292	CZE	832/2	11
86	Spořilov	Praha	73292	CZE	832/2	11
87	Spořilov	Praha	73292	CZE	832/2	11
88	Spořilov	Praha	73292	CZE	832/2	11
89	Spořilov	Praha	73292	CZE	832/2	11
90	Spořilov	Praha	73292	CZE	832/2	11
91	Spořilov	Praha	73292	CZE	832/2	11
92	Spořilov	Praha	73292	CZE	832/2	11
93	Spořilov	Praha	73292	CZE	832/2	11
94	Spořilov	Praha	73292	CZE	832/2	11
95	Spořilov	Praha	73292	CZE	832/2	11
96	Spořilov	Praha	73292	CZE	832/2	11
97	Spořilov	Praha	73292	CZE	832/2	11
98	Spořilov	Praha	73292	CZE	832/2	11
99	Spořilov	Praha	73292	CZE	832/2	11
100	Spořilov	Praha	73292	CZE	832/2	11
101	Spořilov	Praha	73292	CZE	832/2	11
102	Spořilov	Praha	73292	CZE	832/2	11
103	Spořilov	Praha	73292	CZE	832/2	11
104	Spořilov	Praha	73292	CZE	832/2	11
105	Spořilov	Praha	73292	CZE	832/2	11
106	Spořilov	Praha	73292	CZE	832/2	11
107	Spořilov	Praha	73292	CZE	832/2	11
108	Spořilov	Praha	73292	CZE	832/2	11
1	Perun	Praha	73292	CZE	832/2	11
109	Spořilov	Praha	73292	CZE	832/2	11
110	Spořilov	Praha	73292	CZE	832/2	11
111	Spořilov	Praha	73292	CZE	832/2	11
112	Spořilov	Praha	73292	CZE	832/2	11
113	Spořilov	Praha	73292	CZE	832/2	11
114	Spořilov	Praha	73292	CZE	832/2	11
115	Spořilov	Praha	73292	CZE	832/2	11
116	Spořilov	Praha	73292	CZE	832/2	11
117	Spořilov	Praha	73292	CZE	832/2	11
118	Spořilov	Praha	73292	CZE	832/2	11
119	Spořilov	Praha	73292	CZE	832/2	11
120	Spořilov	Praha	73292	CZE	832/2	11
121	Spořilov	Praha	73292	CZE	832/2	11
122	Spořilov	Praha	73292	CZE	832/2	11
123	Perun	Praha	73292	CZE	832/2	11
124	Perun	Praha	73292	CZE	832/2	11
125	Perun	Praha	73292	CZE	832/2	11
126	Perun	Praha	73292	CZE	832/2	11
127	Perun	Praha	73292	CZE	832/2	11
128	Perun	Praha	73292	CZE	832/2	11
129	Perun	Praha	73292	CZE	832/2	11
130	Perun	Praha	73292	CZE	832/2	11
131	Perun	Praha	73292	CZE	832/2	11
132	Perun	Praha	73292	CZE	832/2	11
133	Perun	Praha	73292	CZE	832/2	11
134	Perun	Praha	73292	CZE	832/2	11
135	Perun	Praha	73292	CZE	832/2	11
\.


--
-- Data for Name: exercise_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercise_category (category_id, category_name) FROM stdin;
1	Upper body
2	Lower body
3	Chest
4	Back
5	Legs
6	Shoulders
7	Arms
8	Glutes
9	Core
10	Full Body
11	Bickules
12	Bickules
13	Bickules
14	Bickules
15	Bickules
16	Bickules
17	Bickules
18	Bickules
19	Bickules
20	Bickules
21	Bickules
22	Bickules
23	Bickules
24	Bickules
25	Bickules
26	Bickules
27	Bickules
28	Bickules
29	Bickules
31	Bickules
32	Bickules
33	Bickules
34	Bickules
35	Bickules
36	Bickules
47	Radegast
\.


--
-- Data for Name: exercise_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercise_type (exercise_type_id, type_name, category_id, body_part) FROM stdin;
2	Squat	2	Glutes
1	Lateral raises	1	Deltoids
3	Bicep curl	1	Biceps
5	Bicep curl	1	Bicepz
6	Cable Chest Fly	1	Chest
7	Dumbbell Curl	5	Arms
8	Kettlebell Swing	6	Glutes
9	Bench Press	1	Chest
10	Leg Press	3	Legs
11	Smith Machine Squat	6	Glutes
12	Barbell Squat	3	Legs
13	Lat Pulldown	2	Back
14	Chest Press	1	Chest
15	Seated Row	2	Back
16	Incline Press	1	Chest
17	Hack Squat	3	Legs
18	Shoulder Press	4	Shoulders
19	Cable Crossover	1	Chest
20	Chest Fly	1	Chest
21	Weighted Dip	1	Chest
22	Assisted Pull-Up	2	Back
23	Vertical Leg Press	3	Legs
24	Hip Thrust	6	Glutes
25	Multi Press	8	Full Body
26	Functional Trainer Exercise	8	Full Body
27	Hammer Strength Press	1	Chest
28	barbell bent over rows	1	Back
29	Some type	1	Arm
30	Some type	1	Arm
31	Some type	1	Arm
32	Some type	1	Arm
33	Some type	1	Arm
34	Some type	1	Arm
35	Some type	1	Arm
36	Some type	1	Arm
37	Some type	1	Arm
38	Some type	1	Arm
39	Some type	1	Arm
40	Some type	1	Arm
41	Some type	1	Arm
42	Some type	1	Arm
43	Some type	1	Arm
44	Some type	1	Arm
45	Some type	1	Arm
46	Some type	1	Arm
47	Some type	1	Arm
48	Some type	1	Arm
49	Some type	1	Arm
50	Some type	1	Arm
51	Some type	1	Arm
52	Some type	1	Arm
53	Some type	1	Arm
54	Some type	1	Arm
55	Some type	1	Arm
56	Some type	1	Arm
57	Some type	1	Arm
58	Some type	1	Arm
59	Some type	1	Arm
60	Some type	1	Arm
61	Some type	1	Arm
62	Some type	1	Arm
63	Some type	1	Arm
64	Some type	1	Arm
65	Chernobog	1	Arm
\.


--
-- Data for Name: machine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) FROM stdin;
25	Cables	64	3	2	300	0
3	Dumbells	55	0.5	15	300	0
2	Kettle bells	30	5	5	300	0
1	Bench press	225	1	2	300	0
28	Smith Machine	300	15	1	450	88
29	Squat Rack	300	20	1	400	95
30	Lat Pulldown Machine	150	5	1	300	65
31	Chest Press Machine	220	10	1	250	80
32	Seated Row Machine	200	10	1	300	75
33	Incline Press Machine	200	20	1	350	82
34	Hack Squat Machine	350	25	1	400	78
35	Shoulder Press Machine	180	10	1	300	70
36	Cable Crossover Machine	100	5	2	350	76
37	Chest Fly Machine	200	10	1	250	72
38	Power Rack	400	20	1	500	90
39	Dip Machine	150	5	1	250	65
40	Assisted Pull-Up Machine	120	10	1	300	68
42	Hip Thrust Machine	250	20	1	300	75
43	Multipress Machine	300	15	1	400	85
44	Functional Trainer	150	10	2	450	80
45	Hammer Strength Machine	300	15	1	400	88
27	Leg Press Machine	400	30	4	300	85
41	Vertical Leg Press	320	30	4	350	83
88	Stepping Machine	0	0	1	300	0
50	Stepping Machine	0	0	1	300	0
51	Stepping Machine	0	0	1	300	0
52	Stepping Machine	0	0	1	300	0
53	Stepping Machine	0	0	1	300	0
54	Stepping Machine	0	0	1	300	0
55	Stepping Machine	0	0	1	300	0
86	Stepping Machine	0	0	1	300	0
87	Stepping Machine	0	0	1	300	0
89	Stepping Machine	0	0	1	300	0
90	Stepping Machine	0	0	1	300	0
\.


--
-- Data for Name: machine_exercise_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.machine_exercise_type (exercise_type_id, machine_id) FROM stdin;
1	25
2	1
14	25
2	3
3	2
5	27
6	28
7	29
8	30
9	31
10	32
11	33
12	34
13	35
15	37
16	39
17	40
18	41
19	42
20	43
21	44
22	45
\.


--
-- Data for Name: plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan (plan_id, plan_name, account_id) FROM stdin;
10	Profiq	4
11	Esketit2	4
12	Esketit2	4
1	Lets get Esketit2	4
13	Esketit2	4
14	Esketit2	4
15	Esketit2	4
17	Esketit2	4
22	Esketit2	4
23	Esketit2	4
24	Esketit2	4
25	Esketit2	4
26	Esketit2	4
31	tghdsefb	1
32	Testing UI	1
33	jkhgjkhg	1
34	asddsd	1
35	asdasd	1
36	asdasd	1
37	asdfasdf	1
42	Teemo	1
43	sadfasdf	1
44	sdfsdf	1
45	asdasd	1
46	asdfasdfasdf	1
47	gsdfgsdfg	1
48	JeffNumber2	1
49	Blue suede	1
50	sdafasdf	1
51	asdasdgjhghgjfhjdghdgfhdsdtyhrdhgc	1
52	asdasdgjhghgjfhjdghdgfhdsdtyhrdhgc	1
53	sredyt	1
54	xdvcghfgh	1
55	asdfasdfhyjgfhj	1
56	Testing1231	1
57	Linecke kolecka	1
58	asdfasdf	1
59	asdasd	1
61	asdasd	1
62	asdasd	1
63	asdfasdf	1
66	asdfasdf	1
67	HES BABY KEEM	1
64	asdasd	1
65	asdasd	1
71	TEST-PLAN1233	4
72	TEST-PLAN1233	1
73	TEST-PLAN1233	1
74	TEST-PLAN1233	1
75	Esketit	1
76	TEST-PLAN1233	1
77	Esketit	1
78	TEST-PLAN1233	1
79	Esketit	1
80	TEST-PLAN1233	1
81	Esketit	1
82	TEST-PLAN1233	1
83	Esketit	1
84	TEST-PLAN1233	1
85	Esketit	1
86	TEST-PLAN1233	1
87	Esketit	1
88	TEST-PLAN1233	1
89	Esketit	1
90	TEST-PLAN1233	1
91	Esketit	1
92	TEST-PLAN1233	1
93	Esketit	1
94	TEST-PLAN1233	1
95	Esketit	1
96	TEST-PLAN1233	1
97	Esketit	1
98	TEST-PLAN1233	1
99	Esketit	1
100	TEST-PLAN1233	1
101	Esketit	1
102	TEST-PLAN1233	1
103	Esketit	1
104	TEST-PLAN1233	1
105	Esketit	1
106	TEST-PLAN1233	1
107	Esketit	1
108	TEST-PLAN1233	1
109	Esketit	1
110	TEST-PLAN1233	1
111	Esketit	1
112	TEST-PLAN1233	1
113	Esketit	1
114	TEST-PLAN1233	1
115	Esketit	1
116	TEST-PLAN1233	1
117	Esketit	1
118	TEST-PLAN1233	1
119	Esketit	1
120	TEST-PLAN1233	1
121	Esketit	1
122	TEST-PLAN1233	1
123	Esketit	1
124	TEST-PLAN1233	1
125	Esketit	1
126	TEST-PLAN1233	1
127	Esketit	1
128	TEST-PLAN1233	1
129	Esketit	1
130	TEST-PLAN1233	1
131	Esketit	1
132	TEST-PLAN1233	1
133	Esketit	1
134	TEST-PLAN1233	1
135	Esketit	1
136	TEST-PLAN1233	1
137	Esketit	1
138	TEST-PLAN1233	1
139	Esketit	1
140	TEST-PLAN1233	1
141	Esketit	1
142	TEST-PLAN1233	1
143	Esketit	1
144	TEST-PLAN1233	1
145	Esketit	1
146	TEST-PLAN1233	1
147	Esketit	1
148	TEST-PLAN1233	1
149	Esketit	1
150	TEST-PLAN1233	1
151	Esketit	1
152	TEST-PLAN1233	1
153	Esketit	1
154	TEST-PLAN1233	1
155	Esketit	1
156	TEST-PLAN1233	1
157	Bielobog	1
158	TEST-PLAN1233	1
159	Bielobog	1
160	TEST-PLAN1233	1
161	Bielobog	1
162	TEST-PLAN1233	1
163	Bielobog	1
164	TEST-PLAN1233	1
165	Bielobog	1
166	TEST-PLAN1233	1
167	Bielobog	1
168	TEST-PLAN1233	1
169	Bielobog	1
170	TEST-PLAN1233	1
171	Bielobog	1
172	TEST-PLAN1233	1
173	Bielobog	1
174	TEST-PLAN1233	1
175	Bielobog	1
176	TEST-PLAN1233	1
177	Bielobog	1
178	TEST-PLAN1233	1
179	Bielobog	1
180	TEST-PLAN1233	1
181	Bielobog	1
182	Esketit	1
183	Ekesd	128
184	aasdfsd	128
185	dsdfsdf	128
186	asdfasdf	1
187	Reservation 1	1
188	asdasd	1
189	iuhokjh	1
190	sdfsdf	1
\.


--
-- Data for Name: plan_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_category (plan_id, category_id) FROM stdin;
1	1
1	2
22	1
22	2
23	1
23	2
24	1
24	2
25	1
25	2
26	1
26	2
31	2
32	2
33	1
34	2
35	2
36	2
37	1
42	2
43	1
44	2
45	2
46	1
47	2
48	2
49	1
50	2
51	2
52	2
53	3
54	2
55	1
56	1
57	2
58	4
59	3
63	2
66	4
67	2
75	2
77	2
79	2
81	2
83	2
85	2
87	2
89	2
91	2
93	2
95	2
97	2
99	2
101	2
103	2
105	2
107	2
109	2
111	2
113	2
115	2
117	2
119	2
121	2
123	2
125	2
127	2
129	2
131	2
133	2
135	2
137	2
139	2
141	2
143	2
145	2
147	2
149	2
151	2
153	2
155	2
157	2
159	2
161	2
163	2
165	2
167	2
169	2
171	2
173	2
175	2
177	2
179	2
181	2
182	1
183	2
184	2
185	2
186	2
187	2
188	3
189	2
190	2
190	6
190	3
\.


--
-- Data for Name: plan_machine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) FROM stdin;
1	1	5	1	19:47:57	19:54:59	f
1	2	8	2	19:47:57	20:50:00	t
17	2	3	2	19:47:57	20:47:57	f
17	3	3	2	19:50:57	20:47:57	f
22	2	3	2	19:47:57	20:47:57	f
22	3	3	2	19:50:57	20:47:57	f
23	2	3	2	19:47:57	20:47:57	f
23	3	3	2	19:50:57	20:47:57	f
24	2	3	2	19:47:57	20:47:57	f
24	3	3	2	19:50:57	20:47:57	f
25	2	3	2	19:47:57	20:47:57	f
25	3	3	2	19:50:57	20:47:57	f
26	2	3	2	19:47:57	20:47:57	f
26	3	3	2	19:50:57	20:47:57	f
31	25	5	7	02:02:00	02:02:00	f
32	3	5	7	20:02:00	02:21:00	f
33	25	5	7	23:45:00	23:45:00	f
33	29	4	20	23:45:00	23:45:00	f
33	41	15	20	23:45:00	23:59:00	f
34	25	4	6	00:00:00	00:00:00	f
35	28	4	6	00:00:00	00:00:00	f
36	28	4	6	00:00:00	00:00:00	f
37	25	3	8	02:01:00	00:00:00	f
37	29	4	6	00:00:00	00:00:00	f
42	25	4	6	00:00:00	00:00:00	f
43	25	4	6	00:00:00	00:00:00	f
43	3	4	6	00:00:00	00:00:00	f
43	2	4	6	00:00:00	00:00:00	f
44	36	4	6	00:00:00	00:00:00	f
45	40	4	6	00:00:00	00:00:00	f
45	39	4	6	00:00:00	00:00:00	f
46	25	4	6	00:00:00	01:00:00	f
47	25	4	6	23:22:00	23:44:00	f
50	25	4	6	01:15:00	01:35:00	f
51	25	4	6	03:00:00	04:00:00	f
51	29	4	6	00:00:00	00:00:00	f
52	25	4	6	03:00:00	04:00:00	f
52	29	4	6	00:00:00	00:00:00	f
53	25	4	6	10:25:00	10:28:00	f
56	25	4	6	10:25:00	10:35:00	t
55	25	4	6	01:15:00	01:30:00	t
49	25	4	8	10:15:00	10:25:00	t
54	25	4	6	00:00:00	00:00:00	t
57	25	4	4	10:15:00	10:20:00	t
48	25	4	5	10:13:00	10:15:00	f
58	25	4	6	00:00:00	01:00:00	f
58	30	4	6	01:00:00	02:00:00	t
58	36	4	6	02:00:00	03:00:00	f
59	25	4	6	00:00:00	00:01:00	f
63	39	4	6	00:00:00	00:04:00	f
63	35	4	6	00:04:00	00:09:00	f
63	31	4	6	00:09:00	00:13:00	f
66	25	4	6	00:01:00	00:06:00	f
66	28	4	6	00:06:00	00:13:00	f
66	32	4	6	00:13:00	00:18:00	f
67	25	4	6	00:01:00	00:06:00	f
67	30	4	6	00:06:00	00:11:00	f
67	36	4	6	00:11:00	00:16:00	f
75	25	4	6	09:00:00	09:05:00	f
75	30	4	6	09:05:00	09:10:00	f
75	36	4	6	09:10:00	09:15:00	f
77	25	4	6	09:00:00	09:05:00	f
77	30	4	6	09:05:00	09:10:00	f
77	36	4	6	09:10:00	09:15:00	f
79	25	4	6	09:00:00	09:05:00	f
79	30	4	6	09:05:00	09:10:00	f
79	36	4	6	09:10:00	09:15:00	f
81	25	4	6	09:00:00	09:05:00	f
81	30	4	6	09:05:00	09:10:00	f
81	36	4	6	09:10:00	09:15:00	f
83	25	4	6	09:00:00	09:05:00	f
83	30	4	6	09:05:00	09:10:00	f
83	36	4	6	09:10:00	09:15:00	f
85	25	4	6	09:00:00	09:05:00	f
85	30	4	6	09:05:00	09:10:00	f
85	36	4	6	09:10:00	09:15:00	f
87	25	4	6	09:00:00	09:05:00	f
87	30	4	6	09:05:00	09:10:00	f
87	36	4	6	09:10:00	09:15:00	f
89	25	4	6	09:00:00	09:05:00	f
89	30	4	6	09:05:00	09:10:00	f
89	36	4	6	09:10:00	09:15:00	f
91	25	4	6	09:00:00	09:05:00	f
91	30	4	6	09:05:00	09:10:00	f
91	36	4	6	09:10:00	09:15:00	f
93	25	4	6	09:00:00	09:05:00	f
93	30	4	6	09:05:00	09:10:00	f
93	36	4	6	09:10:00	09:15:00	f
95	25	4	6	09:00:00	09:05:00	f
95	30	4	6	09:05:00	09:10:00	f
95	36	4	6	09:10:00	09:15:00	f
97	25	4	6	09:00:00	09:05:00	f
97	30	4	6	09:05:00	09:10:00	f
97	36	4	6	09:10:00	09:15:00	f
99	25	4	6	09:00:00	09:05:00	f
99	30	4	6	09:05:00	09:10:00	f
99	36	4	6	09:10:00	09:15:00	f
101	25	4	6	09:00:00	09:05:00	f
101	30	4	6	09:05:00	09:10:00	f
101	36	4	6	09:10:00	09:15:00	f
103	25	4	6	09:00:00	09:05:00	f
103	30	4	6	09:05:00	09:10:00	f
103	36	4	6	09:10:00	09:15:00	f
105	25	4	6	09:00:00	09:05:00	f
105	30	4	6	09:05:00	09:10:00	f
105	36	4	6	09:10:00	09:15:00	f
107	25	4	6	09:00:00	09:05:00	f
107	30	4	6	09:05:00	09:10:00	f
107	36	4	6	09:10:00	09:15:00	f
109	25	4	6	09:00:00	09:05:00	f
109	30	4	6	09:05:00	09:10:00	f
109	36	4	6	09:10:00	09:15:00	f
111	25	4	6	09:00:00	09:05:00	f
111	30	4	6	09:05:00	09:10:00	f
111	36	4	6	09:10:00	09:15:00	f
113	25	4	6	09:00:00	09:05:00	f
113	30	4	6	09:05:00	09:10:00	f
113	36	4	6	09:10:00	09:15:00	f
115	25	4	6	09:00:00	09:05:00	f
115	30	4	6	09:05:00	09:10:00	f
115	36	4	6	09:10:00	09:15:00	f
117	25	4	6	09:00:00	09:05:00	f
117	30	4	6	09:05:00	09:10:00	f
117	36	4	6	09:10:00	09:15:00	f
119	25	4	6	09:00:00	09:05:00	f
119	30	4	6	09:05:00	09:10:00	f
119	36	4	6	09:10:00	09:15:00	f
121	25	4	6	09:00:00	09:05:00	f
121	30	4	6	09:05:00	09:10:00	f
121	36	4	6	09:10:00	09:15:00	f
123	25	4	6	09:00:00	09:05:00	f
123	30	4	6	09:05:00	09:10:00	f
123	36	4	6	09:10:00	09:15:00	f
125	25	4	6	09:00:00	09:05:00	f
125	30	4	6	09:05:00	09:10:00	f
125	36	4	6	09:10:00	09:15:00	f
127	25	4	6	09:00:00	09:05:00	f
127	30	4	6	09:05:00	09:10:00	f
127	36	4	6	09:10:00	09:15:00	f
129	25	4	6	09:00:00	09:05:00	f
129	30	4	6	09:05:00	09:10:00	f
129	36	4	6	09:10:00	09:15:00	f
131	25	4	6	09:00:00	09:05:00	f
131	30	4	6	09:05:00	09:10:00	f
131	36	4	6	09:10:00	09:15:00	f
133	25	4	6	09:00:00	09:05:00	f
133	30	4	6	09:05:00	09:10:00	f
133	36	4	6	09:10:00	09:15:00	f
135	25	4	6	09:00:00	09:05:00	f
135	30	4	6	09:05:00	09:10:00	f
135	36	4	6	09:10:00	09:15:00	f
137	25	4	6	09:00:00	09:05:00	f
137	30	4	6	09:05:00	09:10:00	f
137	36	4	6	09:10:00	09:15:00	f
139	25	4	6	09:00:00	09:05:00	f
139	30	4	6	09:05:00	09:10:00	f
139	36	4	6	09:10:00	09:15:00	f
141	25	4	6	09:00:00	09:05:00	f
141	30	4	6	09:05:00	09:10:00	f
141	36	4	6	09:10:00	09:15:00	f
143	25	4	6	09:00:00	09:05:00	f
143	30	4	6	09:05:00	09:10:00	f
143	36	4	6	09:10:00	09:15:00	f
145	25	4	6	09:00:00	09:05:00	f
145	30	4	6	09:05:00	09:10:00	f
145	36	4	6	09:10:00	09:15:00	f
147	25	4	6	09:00:00	09:05:00	f
147	30	4	6	09:05:00	09:10:00	f
147	36	4	6	09:10:00	09:15:00	f
149	25	4	6	09:00:00	09:05:00	f
149	30	4	6	09:05:00	09:10:00	f
149	36	4	6	09:10:00	09:15:00	f
151	25	4	6	09:00:00	09:05:00	f
151	30	4	6	09:05:00	09:10:00	f
151	36	4	6	09:10:00	09:15:00	f
153	25	4	6	09:00:00	09:05:00	f
153	30	4	6	09:05:00	09:10:00	f
153	36	4	6	09:10:00	09:15:00	f
155	25	4	6	09:00:00	09:05:00	f
155	30	4	6	09:05:00	09:10:00	f
155	36	4	6	09:10:00	09:15:00	f
157	25	4	6	09:00:00	09:05:00	f
157	30	4	6	09:05:00	09:10:00	f
157	36	4	6	09:10:00	09:15:00	f
159	25	4	6	09:00:00	09:05:00	f
159	30	4	6	09:05:00	09:10:00	f
159	36	4	6	09:10:00	09:15:00	f
161	25	4	6	09:00:00	09:05:00	f
161	30	4	6	09:05:00	09:10:00	f
161	36	4	6	09:10:00	09:15:00	f
163	25	4	6	09:00:00	09:05:00	f
163	30	4	6	09:05:00	09:10:00	f
163	36	4	6	09:10:00	09:15:00	f
165	25	4	6	09:00:00	09:05:00	f
165	30	4	6	09:05:00	09:10:00	f
165	36	4	6	09:10:00	09:15:00	f
167	25	4	6	09:00:00	09:05:00	f
167	30	4	6	09:05:00	09:10:00	f
167	36	4	6	09:10:00	09:15:00	f
169	25	4	6	09:00:00	09:05:00	f
169	30	4	6	09:05:00	09:10:00	f
169	36	4	6	09:10:00	09:15:00	f
171	25	4	6	09:00:00	09:05:00	f
171	30	4	6	09:05:00	09:10:00	f
171	36	4	6	09:10:00	09:15:00	f
173	25	4	6	09:00:00	09:05:00	f
173	30	4	6	09:05:00	09:10:00	f
173	36	4	6	09:10:00	09:15:00	f
175	25	4	6	09:00:00	09:05:00	f
175	30	4	6	09:05:00	09:10:00	f
175	36	4	6	09:10:00	09:15:00	f
177	25	4	6	09:00:00	09:05:00	f
177	30	4	6	09:05:00	09:10:00	f
177	36	4	6	09:10:00	09:15:00	f
179	25	4	6	09:00:00	09:05:00	f
179	30	4	6	09:05:00	09:10:00	f
179	36	4	6	09:10:00	09:15:00	f
181	25	4	6	09:00:00	09:05:00	f
181	30	4	6	09:05:00	09:10:00	f
181	36	4	6	09:10:00	09:15:00	f
182	25	4	6	00:00:00	00:05:00	f
182	30	4	6	00:05:00	00:10:00	f
182	36	4	6	00:10:00	00:15:00	f
183	25	4	6	00:00:00	00:05:00	f
183	30	4	6	00:05:00	00:10:00	f
183	36	4	6	00:10:00	00:15:00	f
184	25	4	6	00:00:00	00:05:00	f
184	1	4	6	00:00:00	00:06:00	f
184	30	4	6	00:00:00	00:05:00	f
185	25	4	6	00:00:00	00:05:00	f
185	1	4	6	00:05:00	00:10:00	f
185	30	4	6	00:10:00	00:15:00	f
186	25	4	6	00:00:00	00:05:00	f
186	1	4	6	00:05:00	00:10:00	f
186	30	4	6	00:10:00	00:15:00	f
187	25	4	6	00:00:00	00:05:00	f
187	30	4	6	00:05:00	00:10:00	f
187	36	4	6	00:10:00	00:15:00	f
188	25	4	6	00:00:00	00:10:00	f
189	25	4	6	00:05:00	00:10:00	f
189	29	4	6	00:10:00	00:16:00	f
189	34	4	6	00:16:00	00:22:00	f
190	25	4	6	00:05:00	00:10:00	f
190	30	4	6	00:10:00	00:15:00	f
190	36	4	6	00:15:00	00:20:00	f
\.


--
-- Data for Name: plan_machine_preset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_machine_preset (plan_preset_id, machine_id, sets, reps) FROM stdin;
\.


--
-- Data for Name: plan_preset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_preset (plan_preset_id, preset_name, author_id) FROM stdin;
\.


--
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) FROM stdin;
11	30	2024-11-17 17:26:14	3	\N	1
6	5	2024-11-17 17:26:14	1	\N	1
9	2	2024-11-17 17:26:14	1	\N	1
10	2	2024-11-17 17:26:14	1	\N	1
1	3	2024-10-17 19:26:14	1	4	1
12	2	2024-11-17 17:26:14	3	\N	13
13	2	2024-11-17 17:26:14	3	\N	14
14	2	2024-11-17 17:26:14	3	\N	15
15	2	2024-11-17 17:26:14	3	\N	17
16	2	2024-11-17 17:26:14	3	\N	22
17	2	2024-11-17 17:26:14	3	\N	23
18	2	2024-11-17 17:26:14	3	\N	24
19	2	2024-11-17 17:26:14	3	4	25
21	2	2024-11-17 17:26:14	3	\N	26
24	11	2024-12-27 23:00:00	1	\N	31
25	11	2024-12-07 23:00:00	1	\N	32
27	1	2024-12-13 23:00:00	1	\N	34
28	2	2024-12-11 23:00:00	1	\N	35
29	2	2024-12-11 23:00:00	1	6	36
30	1	2024-12-13 23:00:00	1	4	37
31	1	2024-12-21 23:00:00	1	6	42
32	1	2024-12-21 23:00:00	1	6	43
33	1	2024-12-22 23:00:00	1	\N	44
34	1	2024-12-27 23:00:00	1	6	45
35	1	2024-12-11 23:00:00	1	\N	46
36	1	2024-12-11 23:00:00	1	\N	47
48	1	2024-12-11 23:00:00	1	\N	48
37	1	2024-12-11 23:00:00	1	\N	49
38	1	2024-12-10 23:00:00	1	\N	50
39	1	2024-12-10 23:00:00	1	\N	51
40	1	2024-12-10 23:00:00	1	\N	52
41	1	2024-12-10 23:00:00	1	\N	53
42	1	2024-12-10 23:00:00	1	\N	54
44	1	2024-12-10 23:00:00	1	\N	56
45	1	2024-12-11 23:00:00	4	\N	57
26	2	2024-12-12 23:00:00	1	\N	33
46	1	2025-02-18 23:00:00	1	\N	58
47	1	2025-02-19 23:00:00	1	\N	59
49	1	2025-02-26 23:00:00	1	\N	61
50	1	2025-02-26 23:00:00	1	\N	62
51	1	2025-02-25 23:00:00	1	\N	63
52	1	2025-02-18 23:00:00	1	\N	66
53	1	2025-02-18 23:00:00	1	\N	67
57	1	2023-10-01 00:00:00	1	4	1
58	2	2025-02-23 23:00:00	1	\N	75
60	1	2023-10-01 08:00:00	1	4	1
61	1	2023-10-01 08:00:00	1	4	1
62	2	2025-02-23 23:00:00	1	\N	77
63	1	2023-10-01 08:00:00	1	4	1
64	2	2025-02-23 23:00:00	1	\N	79
65	1	2023-10-01 08:00:00	1	4	1
66	2	2025-02-23 23:00:00	1	\N	81
67	1	2023-10-01 08:00:00	1	4	1
68	2	2025-02-23 23:00:00	1	\N	83
69	1	2023-10-01 08:00:00	1	4	1
70	2	2025-02-23 23:00:00	1	\N	85
71	1	2023-10-01 08:00:00	1	4	1
72	2	2025-02-23 23:00:00	1	\N	87
73	1	2023-10-01 08:00:00	1	4	1
74	2	2025-02-23 23:00:00	1	\N	89
75	1	2023-10-01 08:00:00	1	4	1
76	2	2025-02-23 23:00:00	1	\N	91
77	1	2023-10-01 08:00:00	1	4	1
78	2	2025-02-23 23:00:00	1	\N	93
79	1	2023-10-01 08:00:00	1	4	1
80	2	2025-02-23 23:00:00	1	\N	95
81	1	2023-10-01 08:00:00	1	4	1
82	2	2025-02-23 23:00:00	1	\N	97
83	1	2023-10-01 08:00:00	1	4	1
84	2	2025-02-23 23:00:00	1	\N	99
85	1	2023-10-01 08:00:00	1	4	1
86	2	2025-02-23 23:00:00	1	\N	101
87	1	2023-10-01 08:00:00	1	4	1
88	2	2025-02-23 23:00:00	1	\N	103
89	1	2023-10-01 08:00:00	1	4	1
90	2	2025-02-23 23:00:00	1	\N	105
91	1	2023-10-01 08:00:00	1	4	1
92	2	2025-02-23 23:00:00	1	\N	107
93	1	2023-10-01 08:00:00	1	4	1
94	2	2025-02-23 23:00:00	1	\N	109
95	1	2023-10-01 08:00:00	1	4	1
96	2	2025-02-23 23:00:00	1	\N	111
97	1	2023-10-01 08:00:00	1	4	1
98	2	2025-02-23 23:00:00	1	\N	113
99	1	2023-10-01 08:00:00	1	4	1
100	2	2025-02-23 23:00:00	1	\N	115
101	1	2023-10-01 08:00:00	1	4	1
102	2	2025-02-23 23:00:00	1	\N	117
103	1	2023-10-01 08:00:00	1	4	1
104	2	2025-02-23 23:00:00	1	\N	119
105	1	2023-10-01 08:00:00	1	4	1
106	2	2025-02-23 23:00:00	1	\N	121
107	1	2023-10-01 08:00:00	1	4	1
108	2	2025-02-23 23:00:00	1	\N	123
109	1	2023-10-01 00:00:00	1	4	1
110	1	2023-10-01 08:00:00	1	4	1
111	2	2025-02-23 23:00:00	1	\N	125
112	1	2023-10-01 08:00:00	1	4	1
113	2	2025-02-23 23:00:00	1	\N	127
114	1	2023-10-01 08:00:00	1	4	1
115	2	2025-02-23 23:00:00	1	\N	129
116	1	2023-10-01 08:00:00	1	4	1
117	2	2025-02-23 23:00:00	1	\N	131
118	1	2023-10-01 08:00:00	1	4	1
119	2	2025-02-23 23:00:00	1	\N	133
120	1	2023-10-01 08:00:00	1	4	1
121	2	2025-02-23 23:00:00	1	\N	135
122	1	2023-10-01 08:00:00	1	4	1
123	2	2025-02-23 23:00:00	1	\N	137
124	1	2023-10-01 08:00:00	1	4	1
125	2	2025-02-23 23:00:00	1	\N	139
126	1	2023-10-01 08:00:00	1	4	1
127	2	2025-02-23 23:00:00	1	\N	141
128	1	2023-10-01 08:00:00	1	4	1
129	2	2025-02-23 23:00:00	1	\N	143
130	1	2023-10-01 08:00:00	1	4	1
131	2	2025-02-23 23:00:00	1	\N	145
132	1	2023-10-01 08:00:00	1	4	1
133	2	2025-02-23 23:00:00	1	\N	147
134	1	2023-10-01 08:00:00	1	4	1
135	2	2025-02-23 23:00:00	1	\N	149
136	1	2023-10-01 08:00:00	1	4	1
137	2	2025-02-23 23:00:00	1	\N	151
138	1	2023-10-01 08:00:00	1	4	1
139	2	2025-02-23 23:00:00	1	\N	153
140	1	2023-10-01 08:00:00	1	4	1
141	2	2025-02-23 23:00:00	1	\N	155
142	1	2023-10-01 08:00:00	1	4	1
143	2	2025-02-23 23:00:00	1	\N	157
144	1	2023-10-01 08:00:00	1	4	1
146	1	2023-10-01 08:00:00	1	4	1
148	1	2023-10-01 08:00:00	1	4	1
150	1	2023-10-01 08:00:00	1	4	1
152	1	2023-10-01 08:00:00	1	4	1
154	1	2023-10-01 08:00:00	1	4	1
156	1	2023-10-01 08:00:00	1	4	1
158	1	2023-10-01 08:00:00	1	4	1
160	1	2023-10-01 08:00:00	1	4	1
162	1	2023-10-01 08:00:00	1	4	1
164	1	2023-10-01 08:00:00	1	4	1
166	1	2023-10-01 10:00:00	1	4	1
168	1	2025-03-27 23:00:00	1	\N	182
169	1	2025-03-27 23:00:00	128	\N	183
170	1	2025-03-27 23:00:00	128	\N	184
171	1	2025-03-28 00:00:00	128	\N	185
176	1	2025-03-27 00:00:00	1	\N	190
\.


--
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test (id, test) FROM stdin;
1	asdasd
2	testststst
\.


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

SELECT pg_catalog.setval('public.reservation_reservetionid_seq', 176, true);


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

SELECT pg_catalog.setval('public.wrkoutplan_wrkoutplanid_seq', 190, true);


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

