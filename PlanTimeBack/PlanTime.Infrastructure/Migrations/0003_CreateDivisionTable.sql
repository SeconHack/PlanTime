﻿CREATE TABLE division (
                          id SERIAL NOT NULL UNIQUE,
                          division_name TEXT,
                          PRIMARY KEY(id)
);
INSERT INTO division (division_name)
VALUES ('Совет директоров'),
       ('Управляющий директор'),
       ('Заместитель генерального директора по реализации'),
       ('Дирекция по сбыту'),
       ('Управление по работе с юридическими лицами'),
       ('Сектор начислений и расчетов'),
       ('Сектор сопровождения и обслуживания клиентов'),
       ('Управление по работе с населением'),
       ('Сектор начислений и расчетов'),
       ('Сектор сопровождения и обслуживания клиентов'),
       ('Отдел дистанционного обслуживания и анализа'),
       ('Сектор дистанционного обслуживания'),
       ('Сектор анализа'),
       ('Управление организации продаж'),
       ('Сектор по работе с агентами и партнерами'),
       ('Сектор сопровождения коммерческих процессов'),
       ('Отдел перспективного и стратегического планирования'),
       ('Первый заместитель генерального директора'),
       ('Финансовое управление'),
       ('Отдел бюджетирования и экономического анализа'),
       ('Отдел управленческого учета'),
       ('Сектор управленческого учета и анализа'),
       ('Сектор учета и отчетности'),
       ('Отдел бухгалтерского учета и отчетности'),
       ('Сектор расчетов с поставщиками и подрядчиками'),
       ('Сектор налогового учета'),
       ('Заместитель генерального директора по правовым вопросам'),
       ('Правовое управление'),
       ('Отдел договорного права'),
       ('Отдел претензионно-исковой работы'),
       ('Отдел корпоративного управления'),
       ('Сектор корпоративного управления'),
       ('Главный бухгалтер'),
       ('Отдел бухгалтерского учета и отчетности'),
       ('Отдел налогового учета'),
       ('Сектор учета и отчетности'),
       ('Отдел учета заработной платы и расчетов с персоналом'),
       ('Сектор учета заработной платы'),
       ('Сектор расчетов с персоналом'),
       ('Департамент по работе с дебиторской задолженностью'),
       ('Управление по работе с дебиторской задолженностью'),
       ('Отдел по работе с дебиторской задолженностью'),
       ('Сектор по работе с дебиторской задолженностью'),
       ('Отдел учета и анализа дебиторской задолженности'),
       ('Отдел по сопровождению претензионно-исковой работы'),
       ('Сектор учета дебиторской задолженности'),
       ('Сектор претензионно-исковой работы'),
       ('Управление информационных технологий'),
       ('Отдел информационного сопровождения'),
       ('Сектор сопровождения ПО'),
       ('Сектор технической поддержки пользователей'),
       ('Департамент обеспечения безопасности'),
       ('Управление по обеспечению экономической безопасности'),
       ('Отдел безопасности'),
       ('Управление корпоративной защиты'),
       ('Отдел корпоративной защиты'),
       ('Сектор корпоративной защиты'),
       ('Управление администрирования и делопроизводства'),
       ('Отдел администрирования'),
       ('Отдел делопроизводства'),
       ('Отдел информационного взаимодействия'),
       ('Управление материально-технического снабжения'),
       ('Отдел материально-технического снабжения'),
       ('Отдел логистики'),
       ('Сектор логистики'),
       ('Сектор снабжения'),
       ('Сектор делопроизводства'),
       ('Сектор администрирования'),
       ('Представительства'),
       ('Центральное представительство'),
       ('ЦОК Пенза'),
       ('ЦОК Заречный'),
       ('ЦОК Никольск'),
       ('ЦОК Городище'),
       ('ЦОК Спасск'),
       ('ЦОК Лунино'),
       ('Ленинское представительство'),
       ('Васильевский офис'),
       ('Башмаковский офис'),
       ('Сосновоборский офис'),
       ('ЦОК Каменка'),
       ('Кузнецкое представительство'),
       ('Кузнецкий офис'),
       ('Селивановский офис'),
       ('Нижнеломовский офис'),
       ('Мокшанское представительство'),
       ('Мокшанский офис'),
       ('Наровчатский офис'),
       ('Спасское представительство'),
       ('Спасский офис'),
       ('Тамалинский офис'),
       ('Бековский офис'),
       ('Пачелмский офис');
