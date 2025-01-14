const institusjoner = [
  {
    institusjonsID: 'CH:ALLBUCs',
    navn: '001_ALL_BUCs',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:ALLBUCsb',
    navn: '001_ALL_BUCsb',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:ALVALK',
    navn: '042_ALV_ALK',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:ALVALKb',
    navn: '042_ALV_ALKb',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:BITTest01',
    navn: '090_BIT_Test01',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:BITTest02',
    navn: '090_BIT_Test02',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FR:TSCLEISS00',
    navn: 'CENTRE DES LIAISONS EUROPÉENNES ET INTERNATIONALES DE SÉCURITÉ SOCIALE',
    landkode: 'FR',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FR:CIN0000001',
    navn: 'CNAV RINA MUTU1',
    landkode: 'FR',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FR:CIN0000002',
    navn: 'CNAV RINA MUTU2',
    landkode: 'FR',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'HR:3001',
    navn: 'CROATIAN EMPLOYMENT SERVICE',
    landkode: 'HR',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'IE:IEGEN001',
    navn: 'DEASP',
    landkode: 'IE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'IE:IESW0001',
    navn: 'DEASP',
    landkode: 'IE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:DRV6601',
    navn: 'DRV6601',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL202000MP',
    navn: 'Dolnoslaski Voivodship Labour Office in Walbrzych',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:BA11111',
    navn: 'Employment Agency',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST97201',
    navn: 'Employment Agency Bad Daneben',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:BA11100',
    navn: 'Employment Agency Bad Oldesloe',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST99711',
    navn: 'Employment Agency Bad Rennburg',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST97504',
    navn: 'Employment Agency Barmeg',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST99101',
    navn: 'Employment Agency Dankinsel',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST97103',
    navn: 'Employment Agency Hinmeis',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST01101',
    navn: 'Employment Agency Nürnberg',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST01901',
    navn: 'Employment Agency Servicehaus Test',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST99807',
    navn: 'Employment Agency Wiearm',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST97623',
    navn: 'Employment Agency Zirkelchor',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LU:0053',
    navn: 'Employment Office',
    landkode: 'LU',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'IE:IESW0002',
    navn: 'Eng',
    landkode: 'IE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FR:TSRG75V001',
    navn: 'FR RINA DISTRIBUTED',
    landkode: 'FR',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FR:TSRG75V000',
    navn: 'FR RINA MUTUALIZED',
    landkode: 'FR',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FR:TSRG75V002',
    navn: 'FR RINA MUTUALIZED 2',
    landkode: 'FR',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FR:CLEISS0001',
    navn: 'FRENCH LIAISON BODY',
    landkode: 'FR',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH003',
    navn: 'FSIO3',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH004',
    navn: 'FSIO4',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:BA01110',
    navn: 'Federal Employment Agency Headquarters',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST01130',
    navn: 'Federal Employment Agency, Headquarters Test',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LT:188735972',
    navn: 'Foreign benefits office',
    landkode: 'LT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:BATestCI01',
    navn: 'General Federal Employment Agency, Test institution 01',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:BATestCI05',
    navn: 'General Federal Employment Agency, Test institution 05',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:BATestCI02',
    navn: 'General Federal Employment Agency, Test institution 2',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:BATestCI03',
    navn: 'General Federal Employment Agency, Test institution 3',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'DE:BATestCI04',
    navn: 'General Federal Employment Agency, Test institution 4',
    landkode: 'DE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'NO:GFFTEST',
    navn: 'Guarantee Fund for Fishermen',
    landkode: 'NO',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:PTIITST01',
    navn: 'II,IP, Test Institution 01',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:PTIITST02',
    navn: 'II,IP, Test Institution 02',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:PTISSTST01',
    navn: 'ISS,IP, Test Institution 01',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'NL:NL2000CP',
    navn: 'Institute for Employee Benefit Schemes;Uitvoeringsinstituut Werknemersverzekeringen;',
    landkode: 'NL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'NL:NL2000',
    navn: 'Institute for Employee Benefit Schemes;Uitvoeringsinstituut Werknemersverzekeringen;',
    landkode: 'NL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1116',
    navn: 'Institute of Social Security, District Centre of Aveiro',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1113',
    navn: 'Institute of Social Security, District Centre of Beja',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1029',
    navn: 'Institute of Social Security, District Centre of Braga',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1106',
    navn: 'Institute of Social Security, District Centre of Bragança',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1119',
    navn: 'Institute of Social Security, District Centre of Castelo Branco',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1120',
    navn: 'Institute of Social Security, District Centre of Faro',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1118',
    navn: 'Institute of Social Security, District Centre of Guarda',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1111',
    navn: 'Institute of Social Security, District Centre of Leiria',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1121',
    navn: 'Institute of Social Security, District Centre of Lisboa',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1112',
    navn: 'Institute of Social Security, District Centre of Portalegre',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1132',
    navn: 'Institute of Social Security, District Centre of Porto',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1095',
    navn: 'Institute of Social Security, District Centre of Santarém',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1107',
    navn: 'Institute of Social Security, District Centre of Setúbal',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1114',
    navn: 'Institute of Social Security, District Centre of Viana do Castelo',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1115',
    navn: 'Institute of Social Security, District Centre of Viseu',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1117',
    navn: 'Institute of Social Security, District Centre of Évora',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1110',
    navn: 'Institute of Social Security, District of Coimbra',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PT:1108',
    navn: 'Institute of Social Security, Distrist Centre of Vila Real',
    landkode: 'PT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LI:10002',
    navn: 'Institution 02',
    landkode: 'LI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LI:10003',
    navn: 'Institution 03',
    landkode: 'LI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'BE:0411729366',
    navn: 'Landsbond van liberale mutualiteiten',
    landkode: 'BE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL000001',
    navn: 'Ministry of Family, Labour and Social Policy',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'HU:3000',
    navn: 'Ministry of Finance',
    landkode: 'HU',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'NO:NAVT007',
    navn: 'NAV Test 07',
    landkode: 'NO',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'NO:NAVT008',
    navn: 'NAV Test 08',
    landkode: 'NO',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'NO:NAVT002',
    navn: 'NAVT002',
    landkode: 'NO',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'NO:NAVT003',
    navn: 'NAVT003',
    landkode: 'NO',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FR:RG75V00002',
    navn: 'National 2 - Age Insurance Fund',
    landkode: 'FR',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:CA19',
    navn: 'National Health Fund - Headquarters',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FR:RG75V00000',
    navn: 'National old - Age Insurance fund',
    landkode: 'FR',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LI:LI20041',
    navn: 'Office of Economic Affairs 1',
    landkode: 'LI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LI:LI20042',
    navn: 'Office of Economic Affairs 2',
    landkode: 'LI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FR:PE10000001',
    navn: 'POLE EMPLOI SERVICES',
    landkode: 'FR',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FR:TSPE100001',
    navn: 'POLE EMPLOI SERVICES TEST',
    landkode: 'FR',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'BE:RINA4demo',
    navn: 'RINA4 demo',
    landkode: 'BE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'NL:2812',
    navn: 'RINIS foundation',
    landkode: 'NL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'SK:SOCPOIST',
    navn: 'SIA HQ',
    landkode: 'SK',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTEST01',
    navn: 'SIA Test01',
    landkode: 'SK',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTEST02',
    navn: 'SIA Test02',
    landkode: 'SK',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTEST03',
    navn: 'SIA Test03',
    landkode: 'SK',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTEST04',
    navn: 'SIA Test04',
    landkode: 'SK',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CY:SIS1146505',
    navn: 'SOCIAL INSURANCE SERVICES',
    landkode: 'CY',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'SK:RASP',
    navn: 'Social Insurance Agency Routing Application',
    landkode: 'SK',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'SK:100100',
    navn: 'Social Insurance Agency, headquarters',
    landkode: 'SK',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LV:0002',
    navn: 'State Social Insurance Agency T1',
    landkode: 'LV',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LV:0003',
    navn: 'State Social Insurance Agency T2',
    landkode: 'LV',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0100BUC',
    navn: 'TEST 0100 ALL BUC',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FI:0299000003',
    navn: 'TEST_AP testing 3',
    landkode: 'FI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FI:0299000004',
    navn: 'TEST_AP testing 4',
    landkode: 'FI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FI:0199000005',
    navn: 'TEST_AP testing 5',
    landkode: 'FI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FI:0100222222',
    navn: 'TEST_The Social Insurance Institution of Finland',
    landkode: 'FI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FI:5556666666',
    navn: 'TEST_foreign country',
    landkode: 'FI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'EE:TN70001975',
    navn: 'TNEstonian Social Insurance Board',
    landkode: 'EE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'EE:TN70000349',
    navn: 'TNEstonian Tax and Customs Board',
    landkode: 'EE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'EE:TN74000085',
    navn: 'TNEstonian Unemployment Insurance Fund',
    landkode: 'EE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FI:0155555555',
    navn: 'TRN_Finland',
    landkode: 'FI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FI:0503000071',
    navn: 'TRN_IAET-kassa',
    landkode: 'FI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTRN01',
    navn: 'TRN_Social Insurance Agency_01',
    landkode: 'SK',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTRN02',
    navn: 'TRN_Social Insurance Agency_02',
    landkode: 'SK',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTRN03',
    navn: 'TRN_Social Insurance Agency_03',
    landkode: 'SK',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTRN04',
    navn: 'TRN_Social Insurance Agency_04',
    landkode: 'SK',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FI:0502000015',
    navn: 'TRN_The Unemployment Fund of Finnish industrial Workers',
    landkode: 'FI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'FI:5555555555',
    navn: 'TRN_foreign country',
    landkode: 'FI',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'EE:TS74000085',
    navn: 'TSEstonian Unemployment Insurance Fund',
    landkode: 'EE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0142ALK',
    navn: 'Test 01 ALK Allg.',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0101BUC',
    navn: 'Test 01 ALL_BUCs',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0140SEC',
    navn: 'Test 01 ALV UB',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH01421ALK',
    navn: 'Test 011 ALK Allg.',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH01011BUC',
    navn: 'Test 011 ALL_BUCs',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH01401SEC',
    navn: 'Test 011 ALV UB',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0145SEC',
    navn: 'Test 0145 ALV UB',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0147ALK',
    navn: 'Test 0147 ALK Allg.',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0242ALK',
    navn: 'Test 02 ALK Allg.',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0247ALK',
    navn: 'Test 02 ALK2 Allg.',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0201BUC',
    navn: 'Test 02 ALL_BUCs',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0240SEC',
    navn: 'Test 02 ALV UB',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0490BIT',
    navn: 'Test 0490BIT ALL_BUCs EN',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0491BIT',
    navn: 'Test 0491BIT ALL_BUCs EN',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0492BIT',
    navn: 'Test 0492BIT ALL_BUCs EN',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH05421ALK',
    navn: 'Test 05 ALK Allg.',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0542ALK',
    navn: 'Test 05 ALK Allg.',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH05011BUC',
    navn: 'Test 05 ALL_BUCs',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH005',
    navn: 'Test 05 ALL_BUCs',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH05401SEC',
    navn: 'Test 05 ALV UB',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0540SEC',
    navn: 'Test 05 ALV UB',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0500BUC',
    navn: 'Test 0500 ALL BUC English',
    landkode: 'CH',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LU:0201',
    navn: 'Test 1',
    landkode: 'LU',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LU:0202',
    navn: 'Test 2',
    landkode: 'LU',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LU:0203',
    navn: 'Test 3',
    landkode: 'LU',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LU:0204',
    navn: 'Test 4',
    landkode: 'LU',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'SE:TS12600S90',
    navn: 'The Swedish Social Insurance Agency',
    landkode: 'SE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'LT:193322893',
    navn: 'Utenos division',
    landkode: 'LT',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL220000MP',
    navn: 'Voivodship Labour Office in Bialystok',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL222000MP',
    navn: 'Voivodship Labour Office in Gdansk',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL224000MP',
    navn: 'Voivodship Labour Office in Katowice',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL226000MP',
    navn: 'Voivodship Labour Office in Kielce',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL212000MP',
    navn: 'Voivodship Labour Office in Krakow',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL210000MP',
    navn: 'Voivodship Labour Office in Lodz',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL206000MP',
    navn: 'Voivodship Labour Office in Lublin',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL228000MP',
    navn: 'Voivodship Labour Office in Olsztyn',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL216000MP',
    navn: 'Voivodship Labour Office in Opole',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL230000MP',
    navn: 'Voivodship Labour Office in Poznan',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL218000MP',
    navn: 'Voivodship Labour Office in Rzeszow',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL232000MP',
    navn: 'Voivodship Labour Office in Szczecin',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL204000MP',
    navn: 'Voivodship Labour Office in Torun',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL214000MP',
    navn: 'Voivodship Labour Office in Warsaw',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'PL:PL208000MP',
    navn: 'Voivodship Labour Office in Zielona Gora',
    landkode: 'PL',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'BE:rina3',
    navn: 'rina3',
    landkode: 'BE',
    buctype: 'UB_BUC_01'
  },
  {
    institusjonsID: 'CH:ALLBUCs',
    navn: '001_ALL_BUCs',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:ALLBUCsb',
    navn: '001_ALL_BUCsb',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:ALVALK',
    navn: '042_ALV_ALK',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:ALVALKb',
    navn: '042_ALV_ALKb',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:BITTest01',
    navn: '090_BIT_Test01',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:BITTest02',
    navn: '090_BIT_Test02',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FR:TSCLEISS00',
    navn: 'CENTRE DES LIAISONS EUROPÉENNES ET INTERNATIONALES DE SÉCURITÉ SOCIALE',
    landkode: 'FR',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FR:CIN0000001',
    navn: 'CNAV RINA MUTU1',
    landkode: 'FR',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FR:CIN0000002',
    navn: 'CNAV RINA MUTU2',
    landkode: 'FR',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'HR:3001',
    navn: 'CROATIAN EMPLOYMENT SERVICE',
    landkode: 'HR',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'IE:IEGEN001',
    navn: 'DEASP',
    landkode: 'IE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'IE:IESW0001',
    navn: 'DEASP',
    landkode: 'IE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:DRV6601',
    navn: 'DRV6601',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL202000MP',
    navn: 'Dolnoslaski Voivodship Labour Office in Walbrzych',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:BA11111',
    navn: 'Employment Agency',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST97201',
    navn: 'Employment Agency Bad Daneben',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:BA11100',
    navn: 'Employment Agency Bad Oldesloe',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST99711',
    navn: 'Employment Agency Bad Rennburg',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST97504',
    navn: 'Employment Agency Barmeg',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST99101',
    navn: 'Employment Agency Dankinsel',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST97103',
    navn: 'Employment Agency Hinmeis',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST01101',
    navn: 'Employment Agency Nürnberg',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST01901',
    navn: 'Employment Agency Servicehaus Test',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST99807',
    navn: 'Employment Agency Wiearm',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST97623',
    navn: 'Employment Agency Zirkelchor',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LU:0053',
    navn: 'Employment Office',
    landkode: 'LU',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'IE:IESW0002',
    navn: 'Eng',
    landkode: 'IE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FR:TSRG75V001',
    navn: 'FR RINA DISTRIBUTED',
    landkode: 'FR',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FR:TSRG75V000',
    navn: 'FR RINA MUTUALIZED',
    landkode: 'FR',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FR:TSRG75V002',
    navn: 'FR RINA MUTUALIZED 2',
    landkode: 'FR',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FR:CLEISS0001',
    navn: 'FRENCH LIAISON BODY',
    landkode: 'FR',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH003',
    navn: 'FSIO3',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH004',
    navn: 'FSIO4',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:BA01110',
    navn: 'Federal Employment Agency Headquarters',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:TEST01130',
    navn: 'Federal Employment Agency, Headquarters Test',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LT:188735972',
    navn: 'Foreign benefits office',
    landkode: 'LT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:BATestCI01',
    navn: 'General Federal Employment Agency, Test institution 01',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:BATestCI05',
    navn: 'General Federal Employment Agency, Test institution 05',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:BATestCI02',
    navn: 'General Federal Employment Agency, Test institution 2',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:BATestCI03',
    navn: 'General Federal Employment Agency, Test institution 3',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'DE:BATestCI04',
    navn: 'General Federal Employment Agency, Test institution 4',
    landkode: 'DE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'NO:GFFTEST',
    navn: 'Guarantee Fund for Fishermen',
    landkode: 'NO',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:PTIITST01',
    navn: 'II,IP, Test Institution 01',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:PTIITST02',
    navn: 'II,IP, Test Institution 02',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:PTISSTST01',
    navn: 'ISS,IP, Test Institution 01',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'NL:NL2000CP',
    navn: 'Institute for Employee Benefit Schemes;Uitvoeringsinstituut Werknemersverzekeringen;',
    landkode: 'NL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'NL:NL2000',
    navn: 'Institute for Employee Benefit Schemes;Uitvoeringsinstituut Werknemersverzekeringen;',
    landkode: 'NL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1116',
    navn: 'Institute of Social Security, District Centre of Aveiro',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1113',
    navn: 'Institute of Social Security, District Centre of Beja',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1029',
    navn: 'Institute of Social Security, District Centre of Braga',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1106',
    navn: 'Institute of Social Security, District Centre of Bragança',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1119',
    navn: 'Institute of Social Security, District Centre of Castelo Branco',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1120',
    navn: 'Institute of Social Security, District Centre of Faro',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1118',
    navn: 'Institute of Social Security, District Centre of Guarda',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1111',
    navn: 'Institute of Social Security, District Centre of Leiria',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1121',
    navn: 'Institute of Social Security, District Centre of Lisboa',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1112',
    navn: 'Institute of Social Security, District Centre of Portalegre',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1132',
    navn: 'Institute of Social Security, District Centre of Porto',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1095',
    navn: 'Institute of Social Security, District Centre of Santarém',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1107',
    navn: 'Institute of Social Security, District Centre of Setúbal',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1114',
    navn: 'Institute of Social Security, District Centre of Viana do Castelo',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1115',
    navn: 'Institute of Social Security, District Centre of Viseu',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1117',
    navn: 'Institute of Social Security, District Centre of Évora',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1110',
    navn: 'Institute of Social Security, District of Coimbra',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PT:1108',
    navn: 'Institute of Social Security, Distrist Centre of Vila Real',
    landkode: 'PT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LI:10002',
    navn: 'Institution 02',
    landkode: 'LI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LI:10003',
    navn: 'Institution 03',
    landkode: 'LI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'BE:0411729366',
    navn: 'Landsbond van liberale mutualiteiten',
    landkode: 'BE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL000001',
    navn: 'Ministry of Family, Labour and Social Policy',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'HU:3000',
    navn: 'Ministry of Finance',
    landkode: 'HU',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'NO:NAVT007',
    navn: 'NAV Test 07',
    landkode: 'NO',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'NO:NAVT008',
    navn: 'NAV Test 08',
    landkode: 'NO',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'NO:NAVT002',
    navn: 'NAVT002',
    landkode: 'NO',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'NO:NAVT003',
    navn: 'NAVT003',
    landkode: 'NO',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FR:RG75V00002',
    navn: 'National 2 - Age Insurance Fund',
    landkode: 'FR',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:CA19',
    navn: 'National Health Fund - Headquarters',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FR:RG75V00000',
    navn: 'National old - Age Insurance fund',
    landkode: 'FR',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LI:LI20041',
    navn: 'Office of Economic Affairs 1',
    landkode: 'LI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LI:LI20042',
    navn: 'Office of Economic Affairs 2',
    landkode: 'LI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FR:PE10000001',
    navn: 'POLE EMPLOI SERVICES',
    landkode: 'FR',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FR:TSPE100001',
    navn: 'POLE EMPLOI SERVICES TEST',
    landkode: 'FR',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'BE:RINA4demo',
    navn: 'RINA4 demo',
    landkode: 'BE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'NL:2812',
    navn: 'RINIS foundation',
    landkode: 'NL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'SK:SOCPOIST',
    navn: 'SIA HQ',
    landkode: 'SK',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTEST01',
    navn: 'SIA Test01',
    landkode: 'SK',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTEST02',
    navn: 'SIA Test02',
    landkode: 'SK',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTEST03',
    navn: 'SIA Test03',
    landkode: 'SK',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTEST04',
    navn: 'SIA Test04',
    landkode: 'SK',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CY:SIS1146505',
    navn: 'SOCIAL INSURANCE SERVICES',
    landkode: 'CY',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'SK:RASP',
    navn: 'Social Insurance Agency Routing Application',
    landkode: 'SK',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'SK:100100',
    navn: 'Social Insurance Agency, headquarters',
    landkode: 'SK',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LV:0002',
    navn: 'State Social Insurance Agency T1',
    landkode: 'LV',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LV:0003',
    navn: 'State Social Insurance Agency T2',
    landkode: 'LV',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0100BUC',
    navn: 'TEST 0100 ALL BUC',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FI:0299000003',
    navn: 'TEST_AP testing 3',
    landkode: 'FI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FI:0299000004',
    navn: 'TEST_AP testing 4',
    landkode: 'FI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FI:0199000005',
    navn: 'TEST_AP testing 5',
    landkode: 'FI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FI:0100222222',
    navn: 'TEST_The Social Insurance Institution of Finland',
    landkode: 'FI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FI:5556666666',
    navn: 'TEST_foreign country',
    landkode: 'FI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'EE:TN70001975',
    navn: 'TNEstonian Social Insurance Board',
    landkode: 'EE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'EE:TN70000349',
    navn: 'TNEstonian Tax and Customs Board',
    landkode: 'EE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'EE:TN74000085',
    navn: 'TNEstonian Unemployment Insurance Fund',
    landkode: 'EE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FI:0155555555',
    navn: 'TRN_Finland',
    landkode: 'FI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FI:0503000071',
    navn: 'TRN_IAET-kassa',
    landkode: 'FI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTRN01',
    navn: 'TRN_Social Insurance Agency_01',
    landkode: 'SK',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTRN02',
    navn: 'TRN_Social Insurance Agency_02',
    landkode: 'SK',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTRN03',
    navn: 'TRN_Social Insurance Agency_03',
    landkode: 'SK',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'SK:SPTRN04',
    navn: 'TRN_Social Insurance Agency_04',
    landkode: 'SK',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FI:0502000015',
    navn: 'TRN_The Unemployment Fund of Finnish industrial Workers',
    landkode: 'FI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'FI:5555555555',
    navn: 'TRN_foreign country',
    landkode: 'FI',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'EE:TS74000085',
    navn: 'TSEstonian Unemployment Insurance Fund',
    landkode: 'EE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0142ALK',
    navn: 'Test 01 ALK Allg.',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0101BUC',
    navn: 'Test 01 ALL_BUCs',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0140SEC',
    navn: 'Test 01 ALV UB',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH01421ALK',
    navn: 'Test 011 ALK Allg.',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH01011BUC',
    navn: 'Test 011 ALL_BUCs',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH01401SEC',
    navn: 'Test 011 ALV UB',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0145SEC',
    navn: 'Test 0145 ALV UB',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0147ALK',
    navn: 'Test 0147 ALK Allg.',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0242ALK',
    navn: 'Test 02 ALK Allg.',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0247ALK',
    navn: 'Test 02 ALK2 Allg.',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0201BUC',
    navn: 'Test 02 ALL_BUCs',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0240SEC',
    navn: 'Test 02 ALV UB',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0490BIT',
    navn: 'Test 0490BIT ALL_BUCs EN',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0491BIT',
    navn: 'Test 0491BIT ALL_BUCs EN',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0492BIT',
    navn: 'Test 0492BIT ALL_BUCs EN',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH05421ALK',
    navn: 'Test 05 ALK Allg.',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0542ALK',
    navn: 'Test 05 ALK Allg.',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH05011BUC',
    navn: 'Test 05 ALL_BUCs',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH005',
    navn: 'Test 05 ALL_BUCs',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH05401SEC',
    navn: 'Test 05 ALV UB',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0540SEC',
    navn: 'Test 05 ALV UB',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'CH:CH0500BUC',
    navn: 'Test 0500 ALL BUC English',
    landkode: 'CH',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LU:0201',
    navn: 'Test 1',
    landkode: 'LU',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LU:0202',
    navn: 'Test 2',
    landkode: 'LU',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LU:0203',
    navn: 'Test 3',
    landkode: 'LU',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LU:0204',
    navn: 'Test 4',
    landkode: 'LU',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'SE:TS12600S90',
    navn: 'The Swedish Social Insurance Agency',
    landkode: 'SE',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'LT:193322893',
    navn: 'Utenos division',
    landkode: 'LT',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL220000MP',
    navn: 'Voivodship Labour Office in Bialystok',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL222000MP',
    navn: 'Voivodship Labour Office in Gdansk',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL224000MP',
    navn: 'Voivodship Labour Office in Katowice',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL226000MP',
    navn: 'Voivodship Labour Office in Kielce',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL212000MP',
    navn: 'Voivodship Labour Office in Krakow',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL210000MP',
    navn: 'Voivodship Labour Office in Lodz',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL206000MP',
    navn: 'Voivodship Labour Office in Lublin',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL228000MP',
    navn: 'Voivodship Labour Office in Olsztyn',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL216000MP',
    navn: 'Voivodship Labour Office in Opole',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL230000MP',
    navn: 'Voivodship Labour Office in Poznan',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL218000MP',
    navn: 'Voivodship Labour Office in Rzeszow',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL232000MP',
    navn: 'Voivodship Labour Office in Szczecin',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL204000MP',
    navn: 'Voivodship Labour Office in Torun',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL214000MP',
    navn: 'Voivodship Labour Office in Warsaw',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'PL:PL208000MP',
    navn: 'Voivodship Labour Office in Zielona Gora',
    landkode: 'PL',
    buctype: 'H_BUC_01'
  },
  {
    institusjonsID: 'BE:rina3',
    navn: 'rina3',
    landkode: 'BE',
    buctype: 'H_BUC_01'
  }
]

export const mockInstitusjonByLandkode = ({ landkode }: any) => {
  return institusjoner.filter((item: any) => item.landkode === landkode)
}

export const mockInstitusjon = () => {
  return institusjoner
}
