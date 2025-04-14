'use client';

import React, { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Add, Delete, ArrowBack } from '@mui/icons-material';
import axios from 'axios';

// Nigerian states and LGAs (partial list for brevity, you can expand this)
const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

const lgaData = {
  
  'Abia': [
    'Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North', 
    'Isiala Ngwa South', 'Isuikwuato', 'Obi Ngwa', 'Ohafia', 'Osisioma', 'Ugwunagbo', 
    'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umu Nneochi'
],
  'Adamawa': [
            'Demsa', 'Fufure', 'Ganye', 'Gayuk', 'Gombi', 'Grie', 'Hong', 'Jada', 'Lamurde', 
            'Madagali', 'Maiha', 'Mayo Belwa', 'Michika', 'Mubi North', 'Mubi South', 'Numan', 
            'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'
        ],
        'Akwa Ibom': [
            'Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 
            'Ibeno', 'Ibesikpo Asutan', 'Ibiono-Ibom', 'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 
            'Ini', 'Itu', 'Mbo', 'Mkpat-Enin', 'Nsit-Atai', 'Nsit-Ibom', 'Nsit-Ubium', 'Obot Akara', 
            'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung-Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 
            'Uyo'
        ],
        'Anambra': [
            'Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South', 
            'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North', 'Idemili South', 'Ihiala', 
            'Njikoka', 'Nnewi North', 'Nnewi South', 'Ogbaru', 'Onitsha North', 'Onitsha South', 
            'Orumba North', 'Orumba South', 'Oyi'
        ],
        'Bauchi': [
            'Alkaleri', 'Bauchi', 'Bogoro', 'Damban', 'Darazo', 'Dass', 'Gamawa', 'Ganjuwa', 
            'Giade', 'Itas/Gadau', 'Jama’are', 'Katagum', 'Kirfi', 'Misau', 'Ningi', 'Shira', 
            'Tafawa Balewa', 'Toro', 'Warji', 'Zaki'
        ],
        'Bayelsa': [
            'Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 
            'Yenagoa'
        ],  
        'Benue': [
            'Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 
            'Katsina-Ala', 'Konshisha', 'Kwande', 'Logo', 'Makurdi', 'Obi', 'Ogbadibo', 
            'Ohimini', 'Oju', 'Okpokwu', 'Otukpo', 'Tarka', 'Ukum', 'Ushongo'
        ],
        'Borno': [
            'Abadam', 'Askira/Uba', 'Bayo', 'Biu', 'Chibok', 'Damboa', 'Dikwa', 'Gubio', 
            'Gwoza', 'Hawul', 'Jere', 'Kaga', 'Kala/Balge', 'Konduga', 'Kukawa', 'Mafa', 
            'Magumeri', 'Maiduguri', 'Marte', 'Mobbar', 'Ngala', 'Nganzai', 'Shani'
        ],
        'Cross River': [
            'Akpabuyo', 'Bakassi', 'Calabar Municipal', 'Calabar South', 'Etung', 'Ikom', 
            'Obanliku', 'Obubra', 'Obudu', 'Odukpani', 'Okpokwu', 'Yakuur', 'Yala'
        ],
        'Delta': [
            'Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East', 'Ethiope West', 
            'Ika North East', 'Ika South', 'Isoko North', 'Isoko South', 'Ndokwa East', 
            'Ndokwa West', 'Okpe', 'Oshimili North', 'Oshimili South', 'Patani', 
            'Sapele', 'Udu', 'Ughelli North', 'Ughelli South', 'Ukwuani', 
            'Uvwie', 'Warri North', 'Warri South', 'Warri South West'
        ],
        'Ebonyi': [
            'Abakaliki', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Ezza North', 'Ezza South', 
            'Ikwo', 'Ishielu', 'Ivo', 'Ohaozara', 'Ohaukwu', 'Onicha'
        ],
        'Edo': [
            'Akoko-Edo', 'Esan Central', 'Esan North-East', 'Esan South-East', 'Esan West', 
            'Egor', 'Igueben', 'Ikpoba Okha', 'Orhionmwon', 'Oredo', 'Ovia North-East', 
            'Ovia South-West', 'Uhunmwonde'
        ],
        'Ekiti': [
            'Ado Ekiti', 'Efon', 'Ekiti East', 'Ekiti South-West', 'Ekiti West', 'Emure', 
            'Ijero', 'Ikere', 'Ikole', 'Ilejemeje', 'Irepodun/Ifelodun', 'Ise/Orun', 
            'Moba', 'Oye'
        ],
        'Enugu': [
            'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu', 'Igbo-Etiti', 
            'Igbo-Eze North', 'Igbo-Eze South', 'Isi-Uzo', 'Nkanu East', 'Nkanu West', 
            'Nsukka', 'Oji River', 'Udenu', 'Udi', 'Uzo Uwani'
        ],
        'Gombe': [
            'Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gombe', 'Kaltungo', 
            'Kwami', 'Nafada', 'Shongom', 'Yamaltu/Deba'
        ],
        'Imo': [
            'Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte', 'Ideato North', 
            'Ideato South', 'Ihitte/Uboma', 'Ikeduru', 'Isiala Mbano', 'Isu', 
            'Mbaitoli', 'Ngor Okpala', 'Njaba', 'Nkwerre', 'Nwangele', 
            'Obowo', 'Oguta', 'Ohaji/Egbema', 'Okigwe', 
            'Orlu', 'Orsu', 'Owerri Municipal', 
            'Owerri North', 'Owerri West', 'Unuimo'
        ],
        'Jigawa': [
            'Auyo', 'Babura', 'Biriniwa', 'Birnin Kudu', 'Buji', 'Dutse', 'Gagarawa', 
            'Garki', 'Gumel', 'Guri', 'Hadejia', 'Jahun', 'Kafin Hausa', 
            'Kazaure', 'Kiri Kasama', 'Maigatari', 'Malam Madori', 
            'Miga', 'Ringim', 'Roni', 
            'Sule Tankarkar', 'Taura', 'Yankwashi'
        ],
        'Kaduna': [
            'Birnin Gwari', 'Chikun', 'Giwa', 'Igabi', 'Jema’a', 'Kachia', 'Kaduna North', 
            'Kaduna South', 'Kaura', 'Kauru', 'Kubau', 'Lere', 
            'Makarfi', 'Sabon Gari', 'Sanga', 'Soba', 
            'Zango Kataf', 'Zaria'
        ],
        'Kano': [
            'Ajingi', 'Albasu', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Dambatta', 
            'Dawakin Kudu', 'Dawakin Tofa', 'Doguwa', 'Fagge', 'Gabasawa', 'Garko', 'Garun Mallam', 
            'Gaya', 'Gezawa', 'Gwale', 'Gwarzo', 'Kabo', 'Kano Municipal', 'Karaye', 'Kibiya', 
            'Kiru', 'Kumbotso', 'Kunchi', 'Kura', 'Madobi', 'Makoda', 'Minjibir', 'Nasarawa', 
            'Rano', 'Rimin Gado', 'Rogo', 'Shanono', 'Sumaila', 'Takai', 'Tarauni', 'Tofa', 
            'Tsanyawa', 'Tudun Wada', 'Ungogo', 'Warawa', 'Wudil'
        ],
        'Kogi': [
            'Adavi', 'Ajaokuta', 'Ankpa', 'Bassa', 'Dekina', 'Ibaji', 'Idah', 
            'Igalamela Odolu', 'Ijumu', 'Kabba/Bunu', 'Kogi', 
            'Lokoja', 'Mopa Muro', 'Ofu', 'Ogori Magongo', 
            'Okehi', 'Okene', 'Olamaboro', 
            'Omala', 'Yagba East', 'Yagba West'
        ],
        'Kwara': [
            'Asa', 'Baruten', 'Ekiti', 'Ifelodun', 'Ilorin East', 'Ilorin South', 
            'Ilorin West', 'Irepodun', 'Isin', 'Kaiama', 
            'Moro', 'Offa', 'Oke Ero', 'Oyun', 
            'Pategi'
        ],
        'Lagos': [
            'Agege', 'Ajeromi Ifelodun', 'Alimosho', 'Amuwo Odofin', 'Apapa', 
            'Badagry', 'Epe', 'Eti Osa', 'Ibeju Lekki', 
            'Ifako Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 
            'Lagos Island', 'Lagos Mainland', 'Mushin', 
            'Ojo', 'Oshodi Isolo', 
            'Somolu', 'Surulere'
        ],
        'Nasarawa': [
            'Akwanga', 'Doma', 'Karu', 'Keana', 'Keffi', 'Kokona', 
            'Lafia', 'Nasarawa Eggon', 'Nasarawa West', 
            'Obi', 'Toto', 'Wamba'
        ],
        'Niger': [
            'Agaie', 'Agwara', 'Bida', 'Borgu', 'Bosso', 'Chanchaga', 
            'Edati', 'Gbako', 'Gurara', 'Katcha', 
            'Kontagora', 'Lapai', 'Lavun', 
            'Magama', 'Mariga', 'Mashegu', 
            'Mokwa', 'Paikoro', 'Rafi', 
            'Rijau', 'Shiroro', 
            'Suleja', 'Wushishi'
        ],
        'Ogun': [
            'Abeokuta North', 'Abeokuta South', 'Ado Odo/Ota', 'Egbado North', 
            'Egbado South', 'Ewekoro', 'Ifo', 'Ijebu East', 
            'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 
            'Ikenne', 'Imeko Afon', 'Ipokia', 
            'Obafemi Owode', 'Odeda', 
            'Odogbolu', 'Ogun Waterside', 
            'Remo North', 'Sagamu'
        ],
        'Ondo': [
            'Akoko North East', 'Akoko North West', 'Akoko South East', 'Akoko South West', 
            'Akure North', 'Akure South', 'Ese Odo', 'Idanre', 
            'Ifedore', 'Ilaje', 'Ile Oluji/Okeigbo', 
            'Odigbo', 'Okitipupa', 'Ondo East', 
            'Ondo West', 'Ose', 
            'Owo'
        ],
        'Osun': [
            'Aiyedaade', 'Aiyedire', 'Atakunmosa East', 'Atakunmosa West', 
            'Boluwaduro', 'Boripe', 'Ede North', 'Ede South', 
            'Egbedore', 'Ejigbo', 'Ife Central', 
            'Ife East', 'Ife North', 'Ife South', 
            'Ifelodun', 'Ife North East', 
            'Ilesa East', 'Ilesa West', 
            'Isokan', 'Iwo', 
            'Obokun', 'Odo Otin', 
            'Ola Oluwa', 'Oluyole', 
            'Oriade', 'Orolu'
        ],
        'Oyo': [
            'Afijio', 'Akinyele', 'Atiba', 'Atigbo', 'Egbeda', 
            'Ibadan North', 'Ibadan North East', 'Ibadan North West', 
            'Ibadan South East', 'Ibadan South West', 
            'Ibarapa Central', 'Ibarapa East', 
            'Ibarapa North', 'Ido', 
            'Iseyin', 'Itesiwaju', 
            'Iwo', 'Kajola', 
            'Lagelu', 'Ogbomosho North', 
            'Ogbomosho South', 'Oyo East', 
            'Oyo West'
        ],
        'Plateau': [
            'Barkin Ladi', 'Bassa', 'Bokkos', 'Jos East', 'Jos North', 
            'Jos South', 'Kanam', 'Kanke', 
            'Langtang North', 'Langtang South', 
            'Mangu', 'Pankshin', 
            'Qua’an Pan', 'Riyom', 
            'Shendam', 'Wase'
        ],
        'Rivers': [
            'Abua/Odual', 'Ahoada East', 'Ahoada West', 'Akuku Toru', 
            'Andoni', 'Asari-Toru', 'Bonny', 
            'Degema', 'Emohua', 'Etche', 
            'Gokana', 'Ikwerre', 'Khana', 
            'Obio/Akpor', 'Ogba/Egbema/Ndoni', 
            'Ogba/Egbema/Ndoni', 'Ogu/Bolo', 
            'Okrika', 'Omuma', 
            'Opobo/Nkoro', 'Port Harcourt', 
            'Tai'
        ],
        'Sokoto': [
            'Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 
            'Gudu', 'Illela', 'Kebbe', 
            'Kware', 'Rabah', 
            'Sabon Birni', 'Shagari', 
            'Silame', 'Sokoto North', 
            'Sokoto South', 'Tambuwal', 
            'Wamako', 'Wurno'
        ],
        'Taraba': [
            'Ardo Kola', 'Bali', 'Donga', 'Gashaka', 'Gassol', 
            'Ibi', 'Jalingo', 'Karim Lamido', 
            'Kumi', 'Lau', 
            'Sardauna', 'Takum', 
            'Ussa', 'Wukari', 
            'Yorro', 'Zing'
        ],
        'Yobe': [
            'Bade', 'Bursari', 'Damaturu', 'Fika', 'Fune', 
            'Geidam', 'Gujba', 'Gulani', 
            'Jakusko', 'Karasuwa', 
            'Machina', 'Nangere', 
            'Nguru', 'Potiskum', 
            'Tarmuwa', 'Yunusari'
        ],
        'Zamfara': [
            'Anka', 'Bakura', 'Birnin Magaji/Kiyaw', 'Bukkuyum', 
            'Chafe', 'Gummi', 'Gusau', 
            'Maradun', 'Maru', 
            'Shinkafi', 'Talata Mafara', 
            'Tsafe', 'Zurmi'
        ],
        'FCT': [
            'Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 
            'Kwali', 'Municipal'
        ]   
};

const tabs = [
  'Basic Information',
  'Location Details',
  'Financial Information',
  'Financial Details',
  'Social Media',
  'Factory Locations',
  'Contact Persons',
  'Production Details',
  'Products',
  'Services',
  'Staffing',
  'Raw Materials',
  'Machinery and Equipment',
  'Energy Requirements',
  'Environmental Impact Assessment',
  'Investment',
  'Foreign Currency Usage',
];

const CompanyForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isEditMode = !!id;

  const [tab, setTab] = useState(0);

  const [formData, setFormData] = useState({
    company: {
      companyName: '',
      natureOfBusiness: '',
      companyAddress: '',
      companyCity: '',
      state: '',
      lga: '',
      companyPhone: '',
      companyWebsite: '',
      tin: '',
      onStockExchange: '',
      dateListedOnSe: '',
      dateOfIncorporation: '',
    },
    financialDetails: {
      shareholders: '',
      foreignEquity: '',
      nigerianEquity: '',
      financialPeriod: '',
      turnOverPreviousYear: '',
      operatingProfitBeforeTax: '',
      operatingProfitAfterTax: '',
      VAT: '',
      companyTax: '',
      exciseDuty: '',
      initialInvestment: '',
      totalFAIFinancialStatement: '',
      totalFAIAcceptanceCertificate: '',
    },
    socialMedia: [{ socialMediaName: '', url: '' }],
    factoryLocations: [{ locationName: '' }],
    contactPersons: [{ staffName: '', designation: '', phoneNumber: '', email: '' }],
    productionDetails: {
      dateProductionStarted: '',
      prductsAndServices: '',
      designedInstalledCapacity: '',
      operatingCapacity: '',
      percentageForExport: '',
    },
    products: [{ productName: '' }],
    services: [{ serviceName: '' }],
    staffing: {
      staffStrength: '',
      directorExpatriate: 0,
      directorNigerian: 0,
      managementExpatriate: 0,
      managementNigerian: 0,
      otherStaffSkilled: 0,
      otherStaffUnskilled: 0,
    },
    rawMaterials: [{ foreignItem: '', foreignItemQuantity: '', localItem: '', localItemQuantity: '' }],
    machineryAndEquipment: [{ equipmentName: '', sourceOfMachinery: '' }],
    energyRequirements: {
      averageEnergyConsumptionPerDay: '',
      percentageContributionByDisco: '',
      percentageContributionByGenerator: '',
      percentageContributionByOthers: '',
      quantityOfDieselUtilized: '',
      quantityOfGasUtilized: '',
    },
    environmentalImpactAssessment: [{ typeOfAssessment: '', degreeOfAbatementOrRemediation: '' }],
    investment: {
      FDI: '',
      foreign: '',
    },
    foreignCurrencyUsage: [{ importedItemName: '', FX: '', currencyType: '' }],
  });

  const [availableLGAs, setAvailableLGAs] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchCompany = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/companies/${id}`);
          const company = response.data;

          setFormData({
            company: {
              companyName: company.companyName || '',
              natureOfBusiness: company.natureOfBusiness || '',
              companyAddress: company.companyAddress || '',
              companyCity: company.companyCity || '',
              state: company.state || '',
              lga: company.lga || '',
              companyPhone: company.companyPhone || '',
              companyWebsite: company.companyWebsite || '',
              tin: company.tin || '',
              onStockExchange: company.onStockExchange || '',
              dateListedOnSe: company.dateListedOnSe || '',
              dateOfIncorporation: company.dateOfIncorporation || '',
            },
            financialDetails: company.financialDetails || {
              shareholders: '',
              foreignEquity: '',
              nigerianEquity: '',
              financialPeriod: '',
              turnOverPreviousYear: '',
              operatingProfitBeforeTax: '',
              operatingProfitAfterTax: '',
              VAT: '',
              companyTax: '',
              exciseDuty: '',
              initialInvestment: '',
              totalFAIFinancialStatement: '',
              totalFAIAcceptanceCertificate: '',
            },
            socialMedia: company.socialMedia?.length > 0 ? company.socialMedia : [{ socialMediaName: '', url: '' }],
            factoryLocations: company.factoryLocations?.length > 0 ? company.factoryLocations : [{ locationName: '' }],
            contactPersons: company.contactPersons?.length > 0 ? company.contactPersons : [{ staffName: '', designation: '', phoneNumber: '', email: '' }],
            productionDetails: company.productionDetails || {
              dateProductionStarted: '',
              prductsAndServices: '',
              designedInstalledCapacity: '',
              operatingCapacity: '',
              percentageForExport: '',
            },
            products: company.products?.length > 0 ? company.products : [{ productName: '' }],
            services: company.services?.length > 0 ? company.services : [{ serviceName: '' }],
            staffing: company.staffing || {
              staffStrength: '',
              directorExpatriate: 0,
              directorNigerian: 0,
              managementExpatriate: 0,
              managementNigerian: 0,
              otherStaffSkilled: 0,
              otherStaffUnskilled: 0,
            },
            rawMaterials: company.rawMaterials?.length > 0 ? company.rawMaterials : [{ foreignItem: '', foreignItemQuantity: '', localItem: '', localItemQuantity: '' }],
            machineryAndEquipment: company.machineryAndEquipment?.length > 0 ? company.machineryAndEquipment : [{ equipmentName: '', sourceOfMachinery: '' }],
            energyRequirements: company.energyRequirements || {
              averageEnergyConsumptionPerDay: '',
              percentageContributionByDisco: '',
              percentageContributionByGenerator: '',
              percentageContributionByOthers: '',
              quantityOfDieselUtilized: '',
              quantityOfGasUtilized: '',
            },
            environmentalImpactAssessment: company.environmentalImpactAssessment?.length > 0
  ? company.environmentalImpactAssessment
  : [{ typeOfAssessment: '', degreeOfAbatementOrRemediation: '' }],
            investment: company.investment || {
              FDI: '',
              foreign: '',
            },
            foreignCurrencyUsage: company.foreignCurrencyUsage?.length > 0 ? company.foreignCurrencyUsage : [{ importedItemName: '', FX: '', currencyType: '' }],
          });
          setAvailableLGAs(lgaData[company.state] || []);
        } catch (err) {
          setError('Failed to load company data.');
        }
      };

      fetchCompany();
    }
  }, [id, isEditMode]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleNext = () => {
    if (tab < tabs.length - 1) {
      setTab(tab + 1);
    }
  };

  const handlePrevious = () => {
    if (tab > 0) {
      setTab(tab - 1);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>,
    index?: number,
    field?: string,
    arrayField?: 'socialMedia' | 'factoryLocations' | 'contactPersons' | 'products' | 'services' | 'rawMaterials' | 'machineryAndEquipment' | 'foreignCurrencyUsage',
    nestedField?: 'company' | 'financialDetails' | 'productionDetails' | 'staffing' | 'energyRequirements' | 'environmentalImpactAssessment' | 'investment'
  ) => {
    const { name, value } = e.target as HTMLInputElement;

    if (arrayField && index !== undefined && field) {
      setFormData((prev) => ({
        ...prev,
        [arrayField]: prev[arrayField].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    } else if (nestedField && name) {
      setFormData((prev) => ({
        ...prev,
        [nestedField]: {
          ...prev[nestedField],
          [name]: value,
        },
      }));
    } else if (name) {
      setFormData((prev) => ({
        ...prev,
        company: {
          ...prev.company,
          [name]: value,
        },
      }));

      if (name === 'state') {
        setAvailableLGAs(lgaData[value as string] || []);
        setFormData((prev) => ({
          ...prev,
          company: { ...prev.company, lga: '' },
        }));
      }
    }
  };

  const handleAddItem = (
    field: 'socialMedia' | 'factoryLocations' | 'contactPersons' | 'products' | 'services' | 'rawMaterials' | 'machineryAndEquipment' | 'foreignCurrencyUsage' | 'environmentalImpactAssessment'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === 'socialMedia'
          ? [...prev.socialMedia, { socialMediaName: '', url: '' }]
          : field === 'factoryLocations'
          ? [...prev.factoryLocations, { locationName: '' }]
          : field === 'contactPersons'
          ? [...prev.contactPersons, { staffName: '', designation: '', phoneNumber: '', email: '' }]
          : field === 'products'
          ? [...prev.products, { productName: '' }]
          : field === 'services'
          ? [...prev.services, { serviceName: '' }]
          : field === 'rawMaterials'
          ? [...prev.rawMaterials, { foreignItem: '', foreignItemQuantity: '', localItem: '', localItemQuantity: '' }]
          : field === 'machineryAndEquipment'
          ? [...prev.machineryAndEquipment, { equipmentName: '', sourceOfMachinery: '' }]
          : field === 'foreignCurrencyUsage'
          ? [...prev.foreignCurrencyUsage, { importedItemName: '', FX: '', currencyType: '' }]
          : field === 'environmentalImpactAssessment'
          ? [...prev.environmentalImpactAssessment, { typeOfAssessment: '', degreeOfAbatementOrRemediation: '' }]
          : prev[field], // Fallback to prevent undefined
    }));
  };

  const handleRemoveItem = (
    index: number,
    field: 'socialMedia' | 'factoryLocations' | 'contactPersons' | 'products' | 'services' | 'rawMaterials' | 'machineryAndEquipment' | 'foreignCurrencyUsage'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        companyName: formData.company.companyName,
        natureOfBusiness: formData.company.natureOfBusiness,
        companyAddress: formData.company.companyAddress,
        companyCity: formData.company.companyCity,
        state: formData.company.state,
        lga: formData.company.lga,
        companyPhone: formData.company.companyPhone,
        companyWebsite: formData.company.companyWebsite,
        tin: formData.company.tin,
        onStockExchange: formData.company.onStockExchange,
        dateListedOnSe: formData.company.dateListedOnSe,
        dateOfIncorporation: formData.company.dateOfIncorporation,
        financialDetails: formData.financialDetails,
        socialMedia: formData.socialMedia.filter((sm) => sm.socialMediaName || sm.url),
        factoryLocations: formData.factoryLocations.filter((fl) => fl.locationName),
        contactPersons: formData.contactPersons.filter((cp) => cp.staffName || cp.designation || cp.phoneNumber || cp.email),
        productionDetails: formData.productionDetails,
        products: formData.products.filter((p) => p.productName),
        services: formData.services.filter((s) => s.serviceName),
        staffing: formData.staffing,
        rawMaterials: formData.rawMaterials.filter((rm) => rm.foreignItem || rm.foreignItemQuantity || rm.localItem || rm.localItemQuantity),
        machineryAndEquipment: formData.machineryAndEquipment.filter((me) => me.equipmentName || me.sourceOfMachinery),
        energyRequirements: formData.energyRequirements,
        
        environmentalImpactAssessment: formData.environmentalImpactAssessment.filter(
          (assessment) => assessment.typeOfAssessment || assessment.degreeOfAbatementOrRemediation
        ),
        investment: formData.investment,
        foreignCurrencyUsage: formData.foreignCurrencyUsage.filter((fcu) => fcu.importedItemName || fcu.FX || fcu.currencyType),
      };

      if (isEditMode) {
        await axios.put(`${process.env.NEXT_PUBLIC_APP_URL}/companies/${id}`, payload);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/companies`, payload);
      }

      router.push('/dashboard/companies');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        setError('Validation failed: ' + JSON.stringify(err.response.data.errors, null, 2));
      } else {
        setError('Failed to save company.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderTabContent = (tabIndex: number) => {
    switch (tabIndex) {
      case 0: // Basic Information
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.company.companyName}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'company')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nature of Business"
                name="natureOfBusiness"
                value={formData.company.natureOfBusiness}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'company')}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Phone"
                name="companyPhone"
                value={formData.company.companyPhone}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'company')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Website"
                name="companyWebsite"
                value={formData.company.companyWebsite}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'company')}
              />
            </Grid>
          </Grid>
        );
      case 1: // Location Details
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Address"
                name="companyAddress"
                value={formData.company.companyAddress}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'company')}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company City"
                name="companyCity"
                value={formData.company.companyCity}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'company')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  name="state"
                  value={formData.company.state}
                  onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'company')}
                  label="State"
                >
                  <MenuItem value="">Select State</MenuItem>
                  {nigerianStates.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>LGA</InputLabel>
                <Select
                  name="lga"
                  value={formData.company.lga}
                  onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'company')}
                  label="LGA"
                  disabled={!formData.company.state}
                >
                  <MenuItem value="">Select LGA</MenuItem>
                  {availableLGAs.map((lga) => (
                    <MenuItem key={lga} value={lga}>{lga}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2: // Financial Information
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="TIN"
                name="tin"
                value={formData.company.tin}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'company')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>On Stock Exchange</InputLabel>
                <Select
                  name="onStockExchange"
                  value={formData.company.onStockExchange}
                  onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'company')}
                  label="On Stock Exchange"
                >
                  <MenuItem value="">Select Option</MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date Listed on SE"
                name="dateListedOnSe"
                type="date"
                value={formData.company.dateListedOnSe}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'company')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Incorporation"
                name="dateOfIncorporation"
                type="date"
                value={formData.company.dateOfIncorporation}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'company')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        );
      case 3: // Financial Details
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Shareholders"
                name="shareholders"
                value={formData.financialDetails.shareholders}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Foreign Equity"
                name="foreignEquity"
                value={formData.financialDetails.foreignEquity}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nigerian Equity"
                name="nigerianEquity"
                value={formData.financialDetails.nigerianEquity}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Financial Period"
                name="financialPeriod"
                value={formData.financialDetails.financialPeriod}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Turnover Previous Year"
                name="turnOverPreviousYear"
                value={formData.financialDetails.turnOverPreviousYear}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Operating Profit Before Tax"
                name="operatingProfitBeforeTax"
                value={formData.financialDetails.operatingProfitBeforeTax}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Operating Profit After Tax"
                name="operatingProfitAfterTax"
                value={formData.financialDetails.operatingProfitAfterTax}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="VAT"
                name="VAT"
                value={formData.financialDetails.VAT}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Tax"
                name="companyTax"
                value={formData.financialDetails.companyTax}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Excise Duty"
                name="exciseDuty"
                value={formData.financialDetails.exciseDuty}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Initial Investment"
                name="initialInvestment"
                value={formData.financialDetails.initialInvestment}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total FAI (Financial Statement)"
                name="totalFAIFinancialStatement"
                value={formData.financialDetails.totalFAIFinancialStatement}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total FAI (Acceptance Certificate)"
                name="totalFAIAcceptanceCertificate"
                value={formData.financialDetails.totalFAIAcceptanceCertificate}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'financialDetails')}
              />
            </Grid>
          </Grid>
        );
      case 4: // Social Media
        return (
          <Grid container spacing={2}>
            {formData.socialMedia.map((social, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Social Media Name"
                    value={social.socialMediaName}
                    onChange={(e) => handleFormChange(e, index, 'socialMediaName', 'socialMedia')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="URL"
                    value={social.url}
                    onChange={(e) => handleFormChange(e, index, 'url', 'socialMedia')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'socialMedia')}
                    disabled={formData.socialMedia.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button startIcon={<Add />} onClick={() => handleAddItem('socialMedia')}>
                Add Social Media
              </Button>
            </Grid>
          </Grid>
        );
      case 5: // Factory Locations
        return (
          <Grid container spacing={2}>
            {formData.factoryLocations.map((location, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={10}>
                  <TextField
                    fullWidth
                    label="Location Name"
                    value={location.locationName}
                    onChange={(e) => handleFormChange(e, index, 'locationName', 'factoryLocations')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'factoryLocations')}
                    disabled={formData.factoryLocations.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button startIcon={<Add />} onClick={() => handleAddItem('factoryLocations')}>
                Add Factory Location
              </Button>
            </Grid>
          </Grid>
        );
      case 6: // Contact Persons
        return (
          <Grid container spacing={2}>
            {formData.contactPersons.map((contact, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Staff Name"
                    value={contact.staffName}
                    onChange={(e) => handleFormChange(e, index, 'staffName', 'contactPersons')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Designation"
                    value={contact.designation}
                    onChange={(e) => handleFormChange(e, index, 'designation', 'contactPersons')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={contact.phoneNumber}
                    onChange={(e) => handleFormChange(e, index, 'phoneNumber', 'contactPersons')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={contact.email}
                    onChange={(e) => handleFormChange(e, index, 'email', 'contactPersons')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'contactPersons')}
                    disabled={formData.contactPersons.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button startIcon={<Add />} onClick={() => handleAddItem('contactPersons')}>
                Add Contact Person
              </Button>
            </Grid>
          </Grid>
        );
      case 7: // Production Details
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date Production Started"
                name="dateProductionStarted"
                type="date"
                value={formData.productionDetails.dateProductionStarted}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'productionDetails')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Products and Services"
                name="prductsAndServices"
                value={formData.productionDetails.prductsAndServices}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'productionDetails')}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Designed Installed Capacity"
                name="designedInstalledCapacity"
                value={formData.productionDetails.designedInstalledCapacity}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'productionDetails')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Operating Capacity"
                name="operatingCapacity"
                value={formData.productionDetails.operatingCapacity}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'productionDetails')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Percentage for Export"
                name="percentageForExport"
                value={formData.productionDetails.percentageForExport}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'productionDetails')}
              />
            </Grid>
          </Grid>
        );
      case 8: // Products
        return (
          <Grid container spacing={2}>
            {formData.products.map((product, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={10}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={product.productName}
                    onChange={(e) => handleFormChange(e, index, 'productName', 'products')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'products')}
                    disabled={formData.products.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button startIcon={<Add />} onClick={() => handleAddItem('products')}>
                Add Product
              </Button>
            </Grid>
          </Grid>
        );
      case 9: // Services
        return (
          <Grid container spacing={2}>
            {formData.services.map((service, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={10}>
                  <TextField
                    fullWidth
                    label="Service Name"
                    value={service.serviceName}
                    onChange={(e) => handleFormChange(e, index, 'serviceName', 'services')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'services')}
                    disabled={formData.services.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button startIcon={<Add />} onClick={() => handleAddItem('services')}>
                Add Service
              </Button>
            </Grid>
          </Grid>
        );
      case 10: // Staffing
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Staff Strength"
                name="staffStrength"
                value={formData.staffing.staffStrength}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Director Expatriate"
                name="directorExpatriate"
                type="number"
                value={formData.staffing.directorExpatriate}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Director Nigerian"
                name="directorNigerian"
                type="number"
                value={formData.staffing.directorNigerian}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Management Expatriate"
                name="managementExpatriate"
                type="number"
                value={formData.staffing.managementExpatriate}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Management Nigerian"
                name="managementNigerian"
                type="number"
                value={formData.staffing.managementNigerian}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Other Staff Skilled"
                name="otherStaffSkilled"
                type="number"
                value={formData.staffing.otherStaffSkilled}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Other Staff Unskilled"
                name="otherStaffUnskilled"
                type="number"
                value={formData.staffing.otherStaffUnskilled}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'staffing')}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        );
      case 11: // Raw Materials
        return (
          <Grid container spacing={2}>
            {formData.rawMaterials.map((material, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Foreign Item"
                    value={material.foreignItem}
                    onChange={(e) => handleFormChange(e, index, 'foreignItem', 'rawMaterials')}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Foreign Item Quantity"
                    value={material.foreignItemQuantity}
                    onChange={(e) => handleFormChange(e, index, 'foreignItemQuantity', 'rawMaterials')}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Local Item"
                    value={material.localItem}
                    onChange={(e) => handleFormChange(e, index, 'localItem', 'rawMaterials')}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Local Item Quantity"
                    value={material.localItemQuantity}
                    onChange={(e) => handleFormChange(e, index, 'localItemQuantity', 'rawMaterials')}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'rawMaterials')}
                    disabled={formData.rawMaterials.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button startIcon={<Add />} onClick={() => handleAddItem('rawMaterials')}>
                Add Raw Material
              </Button>
            </Grid>
          </Grid>
        );
      case 12: // Machinery and Equipment
        return (
          <Grid container spacing={2}>
            {formData.machineryAndEquipment.map((equipment, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Equipment Name"
                    value={equipment.equipmentName}
                    onChange={(e) => handleFormChange(e, index, 'equipmentName', 'machineryAndEquipment')}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Source of Machinery"
                    value={equipment.sourceOfMachinery}
                    onChange={(e) => handleFormChange(e, index, 'sourceOfMachinery', 'machineryAndEquipment')}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'machineryAndEquipment')}
                    disabled={formData.machineryAndEquipment.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button startIcon={<Add />} onClick={() => handleAddItem('machineryAndEquipment')}>
                Add Machinery/Equipment
              </Button>
            </Grid>
          </Grid>
        );
      case 13: // Energy Requirements
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Average Energy Consumption Per Day"
                name="averageEnergyConsumptionPerDay"
                value={formData.energyRequirements.averageEnergyConsumptionPerDay}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'energyRequirements')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Percentage Contribution by Disco"
                name="percentageContributionByDisco"
                value={formData.energyRequirements.percentageContributionByDisco}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'energyRequirements')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Percentage Contribution by Generator"
                name="percentageContributionByGenerator"
                value={formData.energyRequirements.percentageContributionByGenerator}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'energyRequirements')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Percentage Contribution by Others"
                name="percentageContributionByOthers"
                value={formData.energyRequirements.percentageContributionByOthers}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'energyRequirements')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity of Diesel Utilized"
                name="quantityOfDieselUtilized"
                value={formData.energyRequirements.quantityOfDieselUtilized}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'energyRequirements')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity of Gas Utilized"
                name="quantityOfGasUtilized"
                value={formData.energyRequirements.quantityOfGasUtilized}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'energyRequirements')}
              />
            </Grid>
          </Grid>
        );
        case 14: // Environmental Impact Assessment
        return (
          <Grid container spacing={2}>
            {formData.environmentalImpactAssessment.map((assessment, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth>
                    <InputLabel>Type of Assessment</InputLabel>
                    <Select
                      name="typeOfAssessment"
                      value={assessment.typeOfAssessment}
                      onChange={(e) => handleFormChange(e, index, 'typeOfAssessment', 'environmentalImpactAssessment')}
                      label="Type of Assessment"
                    >
                      <MenuItem value="">Select Type</MenuItem>
                      <MenuItem value="Solid Waste Materials">Solid Waste Materials</MenuItem>
                      <MenuItem value="Fluid Waste Materials">Fluid Waste Materials</MenuItem>
                      <MenuItem value="Gaseous Waste Materials">Gaseous Waste Materials</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Degree of Abatement or Remediation"
                    value={assessment.degreeOfAbatementOrRemediation}
                    onChange={(e) => handleFormChange(e, index, 'degreeOfAbatementOrRemediation', 'environmentalImpactAssessment')}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'environmentalImpactAssessment')}
                    disabled={formData.environmentalImpactAssessment.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                startIcon={<Add />}
                onClick={() => handleAddItem('environmentalImpactAssessment')}
              >
                Add Environmental Impact Assessment
              </Button>
            </Grid>
          </Grid>
        );
      case 15: // Investment
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="FDI"
                name="FDI"
                value={formData.investment.FDI}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'investment')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Foreign"
                name="foreign"
                value={formData.investment.foreign}
                onChange={(e) => handleFormChange(e, undefined, undefined, undefined, 'investment')}
              />
            </Grid>
          </Grid>
        );
      case 16: // Foreign Currency Usage
        return (
          <Grid container spacing={2}>
            {formData.foreignCurrencyUsage.map((usage, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Imported Item Name"
                    value={usage.importedItemName}
                    onChange={(e) => handleFormChange(e, index, 'importedItemName', 'foreignCurrencyUsage')}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="FX"
                    value={usage.FX}
                    onChange={(e) => handleFormChange(e, index, 'FX', 'foreignCurrencyUsage')}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Currency Type"
                    value={usage.currencyType}
                    onChange={(e) => handleFormChange(e, index, 'currencyType', 'foreignCurrencyUsage')}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    onClick={() => handleRemoveItem(index, 'foreignCurrencyUsage')}
                    disabled={formData.foreignCurrencyUsage.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button startIcon={<Add />} onClick={() => handleAddItem('foreignCurrencyUsage')}>
                Add Foreign Currency Usage
              </Button>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.push('/dashboard/companies')}
        sx={{ mb: 2 }}
      >
        Back to Companies
      </Button>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Company' : 'Create Company'}
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          {tabs.map((tabName, index) => (
            <Tab key={index} label={tabName} />
          ))}
        </Tabs>
        <form onSubmit={handleSubmit}>
          {renderTabContent(tab)}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={tab === 0}
            >
              Previous
            </Button>
            <Box>
              <Button
                variant="outlined"
                onClick={handleNext}
                disabled={tab === tabs.length - 1}
                sx={{ mr: 1 }}
              >
                Next
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : null}
              >
                {submitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CompanyForm;