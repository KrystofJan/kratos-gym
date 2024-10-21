--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4 (Debian 16.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

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
    is_active character(1) DEFAULT '1'::bpchar NOT NULL,
    create_date date DEFAULT now() NOT NULL,
    last_online date DEFAULT now() NOT NULL,
    address_id integer,
    credits integer DEFAULT 0 NOT NULL,
    clerk_id character varying(255) NOT NULL,
    profile_picture_url character varying(255)
);


ALTER TABLE public.account OWNER TO "postgres";

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


ALTER SEQUENCE public.account_accountid_seq OWNER TO "postgres";

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


ALTER TABLE public.address OWNER TO "postgres";

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


ALTER SEQUENCE public.address_addressid_seq OWNER TO "postgres";

--
-- Name: address_addressid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.address_addressid_seq OWNED BY public.address.address_id;


--
-- Name: exercise_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercise_type (
    exercise_type_id integer NOT NULL,
    type_name character varying(64) NOT NULL,
    category character varying(64) NOT NULL,
    body_part character varying(32) NOT NULL
);


ALTER TABLE public.exercise_type OWNER TO "postgres";

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


ALTER SEQUENCE public.exercisetype_exercisetypeid_seq OWNER TO "postgres";

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


ALTER TABLE public.machine OWNER TO "postgres";

--
-- Name: machine_exercise_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.machine_exercise_type (
    exercise_type_id integer NOT NULL,
    machine_id integer NOT NULL
);


ALTER TABLE public.machine_exercise_type OWNER TO "postgres";

--
-- Name: plan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan (
    plan_id integer NOT NULL,
    plan_name character varying(64) NOT NULL,
    account_id integer NOT NULL
);


ALTER TABLE public.plan OWNER TO "postgres";

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


ALTER TABLE public.plan_machine OWNER TO "postgres";

--
-- Name: plan_machine_preset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_machine_preset (
    plan_preset_id integer NOT NULL,
    machine_id integer NOT NULL,
    sets integer DEFAULT 4 NOT NULL,
    reps integer DEFAULT 8 NOT NULL
);


ALTER TABLE public.plan_machine_preset OWNER TO "postgres";

--
-- Name: plan_preset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_preset (
    plan_preset_id integer NOT NULL,
    preset_name character varying(64) NOT NULL,
    author_id integer NOT NULL
);


ALTER TABLE public.plan_preset OWNER TO "postgres";

--
-- Name: plan_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_type (
    plan_id integer NOT NULL,
    exercise_type_id integer NOT NULL
);


ALTER TABLE public.plan_type OWNER TO "postgres";

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


ALTER TABLE public.reservation OWNER TO "postgres";

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


ALTER SEQUENCE public.reservation_reservetionid_seq OWNER TO "postgres";

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


ALTER TABLE public.test OWNER TO "postgres";

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


ALTER SEQUENCE public.test_id_seq OWNER TO "postgres";

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


ALTER SEQUENCE public.wrkoutmachine_wrkoutmachineid_seq OWNER TO "postgres";

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


ALTER SEQUENCE public.wrkoutplan_wrkoutplanid_seq OWNER TO "postgres";

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

INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (4, 'Kill', 'Me', 'popi2', 'c', 'killme2@pls.com', '+420 324 546 656', '1', '2024-09-17', '2024-09-17', 2, 0, 'Non', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (6, 'Jonas', 'You', 'popi3', 'c', 'killme@pls.com', '+420 324 546 656', '1', '2024-09-27', '2024-09-26', 3, 0, 'Ese', NULL);
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (128, 'Jan-Kryštof', 'Zahradník', 'testoros', 'c', 'krystofjanwastaken@gmail.com', NULL, '1', '2024-10-12', '2024-10-12', 69, 0, 'user_2nKTn6uRFJEFDY8cKgXxU6IJVwk', 'https://preview.redd.it/new-profile-pictures-for-yall-v0-brdjms2xte3c1.jpg?width=720&format=pjpg&auto=webp&s=ee4dd7a6b958c218987219c7ba5311424d2a3345');
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (1, 'Jan-Kryštof', 'Zahradník', 'zahry', 'c', 'jendazah@gmail.com', NULL, '1', '2024-09-26', '2024-09-26', 3, 0, 'user_2mcZZtJs0f4vZVWv8qIaqSLsoa4', 'https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybWNaWnR6V05HNjhjbW5UOGlsSzdybGQxN3IifQ&w=1920&q=75');
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (133, 'Jan', 'Zahradnik', 'profiq', 'c', 'jan.zahradnik@profiq.com', NULL, '1', '2024-10-19', '2024-10-19', 73, 0, 'user_2neSG9S1XrTx86YhJWhApLE0Q3S', 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybmVTRzgxakgxbW1Rd3RtUDJteVdkTGdZcFMifQ');
INSERT INTO public.account (account_id, first_name, last_name, login, role, email, phone_number, is_active, create_date, last_online, address_id, credits, clerk_id, profile_picture_url) VALUES (3, 'Kill', 'Me', 'popi', 'c', 'killme@pls.com', '+340 291 232 111', '1', '2024-09-17', '2024-09-17', 2, 0, 'NAN', NULL);


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


--
-- Data for Name: exercise_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.exercise_type (exercise_type_id, type_name, category, body_part) VALUES (1, 'Lateral raises', 'Upper body', 'Deltoids');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category, body_part) VALUES (2, 'Squat', 'Lower body', 'Glutes');
INSERT INTO public.exercise_type (exercise_type_id, type_name, category, body_part) VALUES (3, 'Bicep curl', 'Upper body', 'Biceps');


--
-- Data for Name: machine; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (2, '5982a9608626b2cd401a872e515a1425', 168.6873926089709, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (3, 'cabfcf6409eba61ef102117ccf9ba361', 98.35106969416891, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (4, '6a0daacc2ed92f114f9b6cf678b7c0c3', 147.36279054976126, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (5, '0ece9febafb4b33fb78eb1b75dedbbcb', 273.4702987932503, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (6, 'f6ec65513cd43f9d7cbf5af90a50baf5', 296.0900376252126, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (7, '0928eabc4d93dfec9c2adec59a8f7db2', 125.81016153034787, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (8, '83e8749f4d17446498835c42f693e74f', 22.450787412268426, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (9, '6288f4551cb0a817f3bfa8c608aef426', 92.15733155944817, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (10, 'b6d39b0902ff72e2b34233cbbbb869e6', 194.24857793185132, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (11, 'a164027a8116a87baf6c26a14b96cd3c', 109.5075186376537, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (12, '4a4edb37d861ddad3a3882b5f84d4cfc', 180.87967881617763, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (13, 'ce893b48b27d3d8dab4b51ea5c58dcf8', 165.68151959982202, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (14, 'ae69f060aaea981bd30b0852002d8f30', 53.05703383464753, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (15, '00f926d8e683fb9de5e27994f687da23', 161.70566425825018, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (16, 'ae9d97c668e6b6ee9f4f8a18a42fc780', 94.05061158084098, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (17, '97791a42145517dac6209aa3243bb772', 238.81759211466667, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (18, '33d8ec73dc6c45b3a0a49a96f9605355', 96.73356797548011, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (19, '7fbc39bd868f9ecffc2e212695dc7296', 98.02670878072652, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (20, 'd039c29aa67a98ccad59ee63efbd3b9d', 41.41602773562225, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (21, 'b53a0c69fb97f3cebbab3d541523419e', 127.31779302083719, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (22, 'e6e489131a135679d06d356810f4678a', 36.76041967135919, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (23, '5d7661b106aa6353ae40361f9e697b12', 227.02099741833274, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (24, '95d3d6dccb5114a72698d118a3cb0e70', 57.590914370591406, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (1, 'Bench press', 225.97011143342635, 1, 2, 300, 0);
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score) VALUES (25, 'Cables', 64, 3, 2, 300, 0);


--
-- Data for Name: machine_exercise_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (1, 25);
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id) VALUES (2, 1);


--
-- Data for Name: plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (1, 'TEST-PLAN1233', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (10, 'Profiq', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (11, 'Esketit2', 4);
INSERT INTO public.plan (plan_id, plan_name, account_id) VALUES (12, 'Esketit2', 4);


--
-- Data for Name: plan_machine; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (1, 1, 5, 1, '19:47:57', '19:54:59', false);
INSERT INTO public.plan_machine (plan_id, machine_id, sets, reps, start_time, end_time, can_disturb) VALUES (1, 2, 8, 2, '19:47:57', '20:50:00', true);


--
-- Data for Name: plan_machine_preset; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: plan_preset; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: plan_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.plan_type (plan_id, exercise_type_id) VALUES (1, 1);


--
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (6, 5, '2024-11-17 17:26:14', 3, NULL, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (9, 2, '2024-11-17 17:26:14', 3, NULL, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (10, 2, '2024-11-17 17:26:14', 3, NULL, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (1, 3, '2024-10-17 19:26:14', 3, 4, 1);
INSERT INTO public.reservation (reservation_id, amount_of_people, reservation_time, customer_id, trainer_id, plan_id) VALUES (11, 30, '2024-11-17 17:26:14', 3, NULL, 1);


--
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.test (id, test) VALUES (1, 'asdasd');


--
-- Name: account_accountid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_accountid_seq', 133, true);


--
-- Name: address_addressid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_addressid_seq', 73, true);


--
-- Name: exercisetype_exercisetypeid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exercisetype_exercisetypeid_seq', 4, true);


--
-- Name: reservation_reservetionid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_reservetionid_seq', 11, true);


--
-- Name: test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_id_seq', 1, true);


--
-- Name: wrkoutmachine_wrkoutmachineid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wrkoutmachine_wrkoutmachineid_seq', 25, true);


--
-- Name: wrkoutplan_wrkoutplanid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wrkoutplan_wrkoutplanid_seq', 12, true);


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
-- Name: plan_type wrkoutplantype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_type
    ADD CONSTRAINT wrkoutplantype_pkey PRIMARY KEY (plan_id, exercise_type_id);


--
-- Name: account account_addressid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_addressid_fkey FOREIGN KEY (address_id) REFERENCES public.address(address_id);


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
-- Name: plan_type wrkoutplantype_exercisetypeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_type
    ADD CONSTRAINT wrkoutplantype_exercisetypeid_fkey FOREIGN KEY (exercise_type_id) REFERENCES public.exercise_type(exercise_type_id);


--
-- Name: plan_type wrkoutplantype_wrkoutplanid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_type
    ADD CONSTRAINT wrkoutplantype_wrkoutplanid_fkey FOREIGN KEY (plan_id) REFERENCES public.plan(plan_id);


