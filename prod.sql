--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4 (Debian 14.4-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)

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

--
-- Name: channel_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.channel_type AS ENUM (
    '/user/',
    '/c/',
    '/channel/',
    '/'
);


ALTER TYPE public.channel_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel (
    id integer NOT NULL,
    youtube_id text NOT NULL,
    url text NOT NULL,
    html_lang text NOT NULL,
    type public.channel_type NOT NULL,
    language text,
    short_name text NOT NULL,
    human_name text NOT NULL,
    raw_subscriber_count text NOT NULL,
    subscriber_count integer DEFAULT '-1'::integer NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.channel OWNER TO postgres;

--
-- Name: channel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.channel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_id_seq OWNER TO postgres;

--
-- Name: channel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.channel_id_seq OWNED BY public.channel.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: recommendation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendation (
    id integer NOT NULL,
    from_id integer NOT NULL,
    to_id integer NOT NULL,
    rank integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.recommendation OWNER TO postgres;

--
-- Name: recommendation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommendation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommendation_id_seq OWNER TO postgres;

--
-- Name: recommendation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommendation_id_seq OWNED BY public.recommendation.id;


--
-- Name: video; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.video (
    id integer NOT NULL,
    channel_id integer NOT NULL,
    url text NOT NULL,
    raw_like_count text NOT NULL,
    like_count integer DEFAULT '-1'::integer NOT NULL,
    raw_view_count text NOT NULL,
    view_count integer DEFAULT '-1'::integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    raw_published_on text NOT NULL,
    published_on date DEFAULT '1987-09-26'::date NOT NULL,
    crawled boolean DEFAULT false NOT NULL,
    latest_crawl_attempted_at timestamp without time zone NOT NULL,
    crawl_attempt_count integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.video OWNER TO postgres;

--
-- Name: video_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.video_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.video_id_seq OWNER TO postgres;

--
-- Name: video_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.video_id_seq OWNED BY public.video.id;


--
-- Name: channel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel ALTER COLUMN id SET DEFAULT nextval('public.channel_id_seq'::regclass);


--
-- Name: recommendation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendation ALTER COLUMN id SET DEFAULT nextval('public.recommendation_id_seq'::regclass);


--
-- Name: video id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video ALTER COLUMN id SET DEFAULT nextval('public.video_id_seq'::regclass);


--
-- Data for Name: channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel (id, youtube_id, url, html_lang, type, language, short_name, human_name, raw_subscriber_count, subscriber_count, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2022-09-16 10:28:00.752175
1	create_channel	38ad56f9367ad2a585579d5551eafb070c90eac9	2022-09-16 10:28:00.775271
2	create_video	b625986a90aca2f3958f97a0048fd8738f717d2e	2022-09-16 10:28:00.80933
3	create_recommendation	98d6b9f4d7c92380cd4cb4915f3fd736589db8e8	2022-09-16 10:28:00.849595
\.


--
-- Data for Name: recommendation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommendation (id, from_id, to_id, rank, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: video; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.video (id, channel_id, url, raw_like_count, like_count, raw_view_count, view_count, title, description, raw_published_on, published_on, crawled, latest_crawl_attempted_at, crawl_attempt_count, created_at, updated_at) FROM stdin;
\.


--
-- Name: channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.channel_id_seq', 1, false);


--
-- Name: recommendation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recommendation_id_seq', 1, false);


--
-- Name: video_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.video_id_seq', 1, false);


--
-- Name: channel channel_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT channel_id_key UNIQUE (id);


--
-- Name: channel channel_youtube_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT channel_youtube_id_key UNIQUE (youtube_id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: recommendation recommendation_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_id_key UNIQUE (id);


--
-- Name: video video_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video
    ADD CONSTRAINT video_id_key UNIQUE (id);


--
-- Name: idx_channel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_channel_id ON public.video USING btree (channel_id);


--
-- Name: idx_crawl_attempt_count; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_crawl_attempt_count ON public.video USING btree (crawl_attempt_count);


--
-- Name: idx_crawled; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_crawled ON public.video USING btree (crawled);


--
-- Name: idx_human_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_human_name ON public.channel USING btree (human_name);


--
-- Name: idx_latest_crawl_attempted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_latest_crawl_attempted_at ON public.video USING btree (latest_crawl_attempted_at);


--
-- Name: idx_recommendation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recommendation ON public.recommendation USING btree (from_id, to_id);


--
-- Name: idx_short_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_short_name ON public.channel USING btree (short_name);


--
-- Name: idx_url; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_url ON public.video USING btree (url);


--
-- Name: idx_youtube_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_youtube_id ON public.channel USING btree (youtube_id);


--
-- Name: video fk_video_channel; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video
    ADD CONSTRAINT fk_video_channel FOREIGN KEY (channel_id) REFERENCES public.channel(id) ON DELETE CASCADE;


--
-- Name: recommendation fk_video_from; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT fk_video_from FOREIGN KEY (from_id) REFERENCES public.video(id) ON DELETE CASCADE;


--
-- Name: recommendation fk_video_to; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT fk_video_to FOREIGN KEY (to_id) REFERENCES public.video(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

