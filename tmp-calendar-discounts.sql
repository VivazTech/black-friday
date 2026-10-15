-- Descontos de teste no calendário (jan/2027 a out/2027)
-- Percentuais: 25, 30, 35, 40, 45 e alguns X (esgotado)
-- Total: 234 dias
-- Rode no SQL Editor do Supabase do projeto da Black Friday

update public.site_settings
set calendar = jsonb_set(
  calendar,
  '{dailyDiscounts}',
  '[
  {
    "date": "2027-01-01",
    "percentage": "35"
  },
  {
    "date": "2027-01-02",
    "percentage": "45"
  },
  {
    "date": "2027-01-03",
    "percentage": "40"
  },
  {
    "date": "2027-01-04",
    "percentage": "25"
  },
  {
    "date": "2027-01-05",
    "percentage": "X"
  },
  {
    "date": "2027-01-07",
    "percentage": "40"
  },
  {
    "date": "2027-01-08",
    "percentage": "35"
  },
  {
    "date": "2027-01-09",
    "percentage": "40"
  },
  {
    "date": "2027-01-10",
    "percentage": "45"
  },
  {
    "date": "2027-01-11",
    "percentage": "35"
  },
  {
    "date": "2027-01-14",
    "percentage": "25"
  },
  {
    "date": "2027-01-15",
    "percentage": "35"
  },
  {
    "date": "2027-01-16",
    "percentage": "45"
  },
  {
    "date": "2027-01-17",
    "percentage": "40"
  },
  {
    "date": "2027-01-18",
    "percentage": "45"
  },
  {
    "date": "2027-01-20",
    "percentage": "X"
  },
  {
    "date": "2027-01-21",
    "percentage": "35"
  },
  {
    "date": "2027-01-22",
    "percentage": "35"
  },
  {
    "date": "2027-01-23",
    "percentage": "40"
  },
  {
    "date": "2027-01-24",
    "percentage": "45"
  },
  {
    "date": "2027-01-25",
    "percentage": "30"
  },
  {
    "date": "2027-01-28",
    "percentage": "45"
  },
  {
    "date": "2027-01-29",
    "percentage": "35"
  },
  {
    "date": "2027-01-30",
    "percentage": "45"
  },
  {
    "date": "2027-01-31",
    "percentage": "40"
  },
  {
    "date": "2027-02-01",
    "percentage": "40"
  },
  {
    "date": "2027-02-04",
    "percentage": "30"
  },
  {
    "date": "2027-02-05",
    "percentage": "35"
  },
  {
    "date": "2027-02-06",
    "percentage": "45"
  },
  {
    "date": "2027-02-07",
    "percentage": "40"
  },
  {
    "date": "2027-02-08",
    "percentage": "25"
  },
  {
    "date": "2027-02-10",
    "percentage": "X"
  },
  {
    "date": "2027-02-11",
    "percentage": "40"
  },
  {
    "date": "2027-02-12",
    "percentage": "35"
  },
  {
    "date": "2027-02-13",
    "percentage": "40"
  },
  {
    "date": "2027-02-14",
    "percentage": "45"
  },
  {
    "date": "2027-02-15",
    "percentage": "35"
  },
  {
    "date": "2027-02-18",
    "percentage": "25"
  },
  {
    "date": "2027-02-19",
    "percentage": "35"
  },
  {
    "date": "2027-02-20",
    "percentage": "45"
  },
  {
    "date": "2027-02-21",
    "percentage": "40"
  },
  {
    "date": "2027-02-22",
    "percentage": "45"
  },
  {
    "date": "2027-02-25",
    "percentage": "35"
  },
  {
    "date": "2027-02-26",
    "percentage": "35"
  },
  {
    "date": "2027-02-27",
    "percentage": "40"
  },
  {
    "date": "2027-02-28",
    "percentage": "45"
  },
  {
    "date": "2027-03-01",
    "percentage": "45"
  },
  {
    "date": "2027-03-04",
    "percentage": "35"
  },
  {
    "date": "2027-03-05",
    "percentage": "35"
  },
  {
    "date": "2027-03-06",
    "percentage": "45"
  },
  {
    "date": "2027-03-07",
    "percentage": "40"
  },
  {
    "date": "2027-03-08",
    "percentage": "30"
  },
  {
    "date": "2027-03-10",
    "percentage": "X"
  },
  {
    "date": "2027-03-11",
    "percentage": "45"
  },
  {
    "date": "2027-03-12",
    "percentage": "35"
  },
  {
    "date": "2027-03-13",
    "percentage": "40"
  },
  {
    "date": "2027-03-14",
    "percentage": "45"
  },
  {
    "date": "2027-03-15",
    "percentage": "40"
  },
  {
    "date": "2027-03-18",
    "percentage": "30"
  },
  {
    "date": "2027-03-19",
    "percentage": "35"
  },
  {
    "date": "2027-03-20",
    "percentage": "45"
  },
  {
    "date": "2027-03-21",
    "percentage": "40"
  },
  {
    "date": "2027-03-22",
    "percentage": "25"
  },
  {
    "date": "2027-03-25",
    "percentage": "40"
  },
  {
    "date": "2027-03-26",
    "percentage": "35"
  },
  {
    "date": "2027-03-27",
    "percentage": "40"
  },
  {
    "date": "2027-03-28",
    "percentage": "45"
  },
  {
    "date": "2027-03-29",
    "percentage": "35"
  },
  {
    "date": "2027-03-30",
    "percentage": "X"
  },
  {
    "date": "2027-04-01",
    "percentage": "25"
  },
  {
    "date": "2027-04-02",
    "percentage": "35"
  },
  {
    "date": "2027-04-03",
    "percentage": "40"
  },
  {
    "date": "2027-04-04",
    "percentage": "45"
  },
  {
    "date": "2027-04-05",
    "percentage": "45"
  },
  {
    "date": "2027-04-08",
    "percentage": "35"
  },
  {
    "date": "2027-04-09",
    "percentage": "35"
  },
  {
    "date": "2027-04-10",
    "percentage": "45"
  },
  {
    "date": "2027-04-11",
    "percentage": "40"
  },
  {
    "date": "2027-04-12",
    "percentage": "30"
  },
  {
    "date": "2027-04-15",
    "percentage": "45"
  },
  {
    "date": "2027-04-16",
    "percentage": "35"
  },
  {
    "date": "2027-04-17",
    "percentage": "40"
  },
  {
    "date": "2027-04-18",
    "percentage": "45"
  },
  {
    "date": "2027-04-19",
    "percentage": "40"
  },
  {
    "date": "2027-04-20",
    "percentage": "X"
  },
  {
    "date": "2027-04-22",
    "percentage": "30"
  },
  {
    "date": "2027-04-23",
    "percentage": "35"
  },
  {
    "date": "2027-04-24",
    "percentage": "45"
  },
  {
    "date": "2027-04-25",
    "percentage": "40"
  },
  {
    "date": "2027-04-26",
    "percentage": "25"
  },
  {
    "date": "2027-04-29",
    "percentage": "40"
  },
  {
    "date": "2027-04-30",
    "percentage": "35"
  },
  {
    "date": "2027-05-01",
    "percentage": "40"
  },
  {
    "date": "2027-05-02",
    "percentage": "45"
  },
  {
    "date": "2027-05-03",
    "percentage": "40"
  },
  {
    "date": "2027-05-05",
    "percentage": "X"
  },
  {
    "date": "2027-05-06",
    "percentage": "30"
  },
  {
    "date": "2027-05-07",
    "percentage": "35"
  },
  {
    "date": "2027-05-08",
    "percentage": "45"
  },
  {
    "date": "2027-05-09",
    "percentage": "40"
  },
  {
    "date": "2027-05-10",
    "percentage": "25"
  },
  {
    "date": "2027-05-13",
    "percentage": "40"
  },
  {
    "date": "2027-05-14",
    "percentage": "35"
  },
  {
    "date": "2027-05-15",
    "percentage": "40"
  },
  {
    "date": "2027-05-16",
    "percentage": "45"
  },
  {
    "date": "2027-05-17",
    "percentage": "35"
  },
  {
    "date": "2027-05-20",
    "percentage": "25"
  },
  {
    "date": "2027-05-21",
    "percentage": "35"
  },
  {
    "date": "2027-05-22",
    "percentage": "45"
  },
  {
    "date": "2027-05-23",
    "percentage": "40"
  },
  {
    "date": "2027-05-24",
    "percentage": "45"
  },
  {
    "date": "2027-05-25",
    "percentage": "X"
  },
  {
    "date": "2027-05-27",
    "percentage": "35"
  },
  {
    "date": "2027-05-28",
    "percentage": "35"
  },
  {
    "date": "2027-05-29",
    "percentage": "40"
  },
  {
    "date": "2027-05-30",
    "percentage": "45"
  },
  {
    "date": "2027-05-31",
    "percentage": "30"
  },
  {
    "date": "2027-06-03",
    "percentage": "45"
  },
  {
    "date": "2027-06-04",
    "percentage": "35"
  },
  {
    "date": "2027-06-05",
    "percentage": "40"
  },
  {
    "date": "2027-06-06",
    "percentage": "45"
  },
  {
    "date": "2027-06-07",
    "percentage": "40"
  },
  {
    "date": "2027-06-10",
    "percentage": "30"
  },
  {
    "date": "2027-06-11",
    "percentage": "35"
  },
  {
    "date": "2027-06-12",
    "percentage": "45"
  },
  {
    "date": "2027-06-13",
    "percentage": "40"
  },
  {
    "date": "2027-06-14",
    "percentage": "25"
  },
  {
    "date": "2027-06-15",
    "percentage": "X"
  },
  {
    "date": "2027-06-17",
    "percentage": "40"
  },
  {
    "date": "2027-06-18",
    "percentage": "35"
  },
  {
    "date": "2027-06-19",
    "percentage": "40"
  },
  {
    "date": "2027-06-20",
    "percentage": "45"
  },
  {
    "date": "2027-06-21",
    "percentage": "35"
  },
  {
    "date": "2027-06-24",
    "percentage": "25"
  },
  {
    "date": "2027-06-25",
    "percentage": "35"
  },
  {
    "date": "2027-06-26",
    "percentage": "45"
  },
  {
    "date": "2027-06-27",
    "percentage": "40"
  },
  {
    "date": "2027-06-28",
    "percentage": "45"
  },
  {
    "date": "2027-06-30",
    "percentage": "X"
  },
  {
    "date": "2027-07-01",
    "percentage": "40"
  },
  {
    "date": "2027-07-02",
    "percentage": "35"
  },
  {
    "date": "2027-07-03",
    "percentage": "40"
  },
  {
    "date": "2027-07-04",
    "percentage": "45"
  },
  {
    "date": "2027-07-05",
    "percentage": "35"
  },
  {
    "date": "2027-07-08",
    "percentage": "25"
  },
  {
    "date": "2027-07-09",
    "percentage": "35"
  },
  {
    "date": "2027-07-10",
    "percentage": "45"
  },
  {
    "date": "2027-07-11",
    "percentage": "40"
  },
  {
    "date": "2027-07-12",
    "percentage": "45"
  },
  {
    "date": "2027-07-15",
    "percentage": "35"
  },
  {
    "date": "2027-07-16",
    "percentage": "35"
  },
  {
    "date": "2027-07-17",
    "percentage": "40"
  },
  {
    "date": "2027-07-18",
    "percentage": "45"
  },
  {
    "date": "2027-07-19",
    "percentage": "30"
  },
  {
    "date": "2027-07-20",
    "percentage": "X"
  },
  {
    "date": "2027-07-22",
    "percentage": "45"
  },
  {
    "date": "2027-07-23",
    "percentage": "35"
  },
  {
    "date": "2027-07-24",
    "percentage": "45"
  },
  {
    "date": "2027-07-25",
    "percentage": "40"
  },
  {
    "date": "2027-07-26",
    "percentage": "40"
  },
  {
    "date": "2027-07-29",
    "percentage": "30"
  },
  {
    "date": "2027-07-30",
    "percentage": "35"
  },
  {
    "date": "2027-07-31",
    "percentage": "40"
  },
  {
    "date": "2027-08-01",
    "percentage": "40"
  },
  {
    "date": "2027-08-02",
    "percentage": "25"
  },
  {
    "date": "2027-08-05",
    "percentage": "40"
  },
  {
    "date": "2027-08-06",
    "percentage": "35"
  },
  {
    "date": "2027-08-07",
    "percentage": "40"
  },
  {
    "date": "2027-08-08",
    "percentage": "45"
  },
  {
    "date": "2027-08-09",
    "percentage": "35"
  },
  {
    "date": "2027-08-10",
    "percentage": "X"
  },
  {
    "date": "2027-08-12",
    "percentage": "25"
  },
  {
    "date": "2027-08-13",
    "percentage": "35"
  },
  {
    "date": "2027-08-14",
    "percentage": "45"
  },
  {
    "date": "2027-08-15",
    "percentage": "40"
  },
  {
    "date": "2027-08-16",
    "percentage": "45"
  },
  {
    "date": "2027-08-19",
    "percentage": "35"
  },
  {
    "date": "2027-08-20",
    "percentage": "35"
  },
  {
    "date": "2027-08-21",
    "percentage": "40"
  },
  {
    "date": "2027-08-22",
    "percentage": "45"
  },
  {
    "date": "2027-08-23",
    "percentage": "30"
  },
  {
    "date": "2027-08-25",
    "percentage": "X"
  },
  {
    "date": "2027-08-26",
    "percentage": "45"
  },
  {
    "date": "2027-08-27",
    "percentage": "35"
  },
  {
    "date": "2027-08-28",
    "percentage": "45"
  },
  {
    "date": "2027-08-29",
    "percentage": "40"
  },
  {
    "date": "2027-08-30",
    "percentage": "40"
  },
  {
    "date": "2027-09-02",
    "percentage": "30"
  },
  {
    "date": "2027-09-03",
    "percentage": "35"
  },
  {
    "date": "2027-09-04",
    "percentage": "45"
  },
  {
    "date": "2027-09-05",
    "percentage": "40"
  },
  {
    "date": "2027-09-06",
    "percentage": "25"
  },
  {
    "date": "2027-09-09",
    "percentage": "40"
  },
  {
    "date": "2027-09-10",
    "percentage": "35"
  },
  {
    "date": "2027-09-11",
    "percentage": "40"
  },
  {
    "date": "2027-09-12",
    "percentage": "45"
  },
  {
    "date": "2027-09-13",
    "percentage": "35"
  },
  {
    "date": "2027-09-15",
    "percentage": "X"
  },
  {
    "date": "2027-09-16",
    "percentage": "25"
  },
  {
    "date": "2027-09-17",
    "percentage": "35"
  },
  {
    "date": "2027-09-18",
    "percentage": "45"
  },
  {
    "date": "2027-09-19",
    "percentage": "40"
  },
  {
    "date": "2027-09-20",
    "percentage": "45"
  },
  {
    "date": "2027-09-23",
    "percentage": "35"
  },
  {
    "date": "2027-09-24",
    "percentage": "35"
  },
  {
    "date": "2027-09-25",
    "percentage": "40"
  },
  {
    "date": "2027-09-26",
    "percentage": "45"
  },
  {
    "date": "2027-09-27",
    "percentage": "30"
  },
  {
    "date": "2027-09-30",
    "percentage": "45"
  },
  {
    "date": "2027-10-01",
    "percentage": "35"
  },
  {
    "date": "2027-10-02",
    "percentage": "45"
  },
  {
    "date": "2027-10-03",
    "percentage": "40"
  },
  {
    "date": "2027-10-04",
    "percentage": "45"
  },
  {
    "date": "2027-10-05",
    "percentage": "X"
  },
  {
    "date": "2027-10-07",
    "percentage": "35"
  },
  {
    "date": "2027-10-08",
    "percentage": "35"
  },
  {
    "date": "2027-10-09",
    "percentage": "40"
  },
  {
    "date": "2027-10-10",
    "percentage": "45"
  },
  {
    "date": "2027-10-11",
    "percentage": "30"
  },
  {
    "date": "2027-10-14",
    "percentage": "45"
  },
  {
    "date": "2027-10-15",
    "percentage": "35"
  },
  {
    "date": "2027-10-16",
    "percentage": "45"
  },
  {
    "date": "2027-10-17",
    "percentage": "40"
  },
  {
    "date": "2027-10-18",
    "percentage": "40"
  },
  {
    "date": "2027-10-20",
    "percentage": "X"
  },
  {
    "date": "2027-10-21",
    "percentage": "30"
  },
  {
    "date": "2027-10-22",
    "percentage": "35"
  },
  {
    "date": "2027-10-23",
    "percentage": "40"
  },
  {
    "date": "2027-10-24",
    "percentage": "45"
  },
  {
    "date": "2027-10-25",
    "percentage": "25"
  },
  {
    "date": "2027-10-28",
    "percentage": "40"
  },
  {
    "date": "2027-10-29",
    "percentage": "35"
  },
  {
    "date": "2027-10-30",
    "percentage": "45"
  },
  {
    "date": "2027-10-31",
    "percentage": "40"
  }
]'::jsonb,
  true
);

-- Conferência
select
  calendar->>'periodStart' as period_start,
  calendar->>'periodEnd' as period_end,
  jsonb_array_length(calendar->'dailyDiscounts') as total_dias,
  (
    select jsonb_agg(distinct d->>'percentage' order by d->>'percentage')
    from jsonb_array_elements(calendar->'dailyDiscounts') d
  ) as percentuais
from public.site_settings;
