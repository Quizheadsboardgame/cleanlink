export const translations = {
  en: {
    nav: {
      stores: "Stores Order",
      faulty: "Faulty Equipment",
      incomplete: "Incomplete Task",
      hours: "Request Hours",
      referral: "Refer a Friend",
      cover: "Cover Work",
      status: "Status Board",
      info: "Information",
      guide: "How to Use",
      language: "Language",
    },
    footer: {
      tagline: "Powered by AI (Harley)",
      copyright: "© 2024 SMART HARLEY TECHNOLOGIES",
      subtext: "Advanced Infrastructure Management System",
    },
    language: {
      title: "Interface Language",
      description: "Select your preferred language for the CleanLink matrix.",
      select: "Select Language",
      back: "Return to Console",
    },
    common: {
      submit: "Submit",
      loading: "Processing...",
      site: "Site",
      name: "Name",
      date: "Date",
    }
  },
  es: {
    nav: {
      stores: "Pedido de Almacén",
      faulty: "Equipo Defectuoso",
      incomplete: "Tarea Incompleta",
      hours: "Solicitar Horas",
      referral: "Recomendar Amigo",
      cover: "Trabajo de Cobertura",
      status: "Panel de Estado",
      info: "Información",
      guide: "Cómo usar",
      language: "Idioma",
    },
    footer: {
      tagline: "Potenciado por IA (Harley)",
      copyright: "© 2024 TECNOLOGÍAS SMART HARLEY",
      subtext: "Sistema Avanzado de Gestión de Infraestructura",
    },
    language: {
      title: "Idioma de la Interfaz",
      description: "Seleccione su idioma preferido para la matriz CleanLink.",
      select: "Seleccionar Idioma",
      back: "Volver a la Consola",
    },
    common: {
      submit: "Enviar",
      loading: "Procesando...",
      site: "Sitio",
      name: "Nombre",
      date: "Fecha",
    }
  },
  pt: {
    nav: {
      stores: "Pedido de Estoque",
      faulty: "Equipamento com Defeito",
      incomplete: "Tarefa Incompleta",
      hours: "Solicitar Horas",
      referral: "Indicar Amigo",
      cover: "Trabalho de Cobertura",
      status: "Painel de Status",
      info: "Informação",
      guide: "Como Usar",
      language: "Idioma",
    },
    footer: {
      tagline: "Desenvolvido por IA (Harley)",
      copyright: "© 2024 TECNOLOGIAS SMART HARLEY",
      subtext: "Sistema Avançado de Gestão de Infraestrutura",
    },
    language: {
      title: "Idioma da Interface",
      description: "Selecione seu idioma preferido para a matriz CleanLink.",
      select: "Selecionar Idioma",
      back: "Voltar para o Console",
    },
    common: {
      submit: "Enviar",
      loading: "Processando...",
      site: "Local",
      name: "Nome",
      date: "Data",
    }
  },
  pl: {
    nav: {
      stores: "Zamówienie Magazynowe",
      faulty: "Wadliwy Sprzęt",
      incomplete: "Niedokończone Zadanie",
      hours: "Prośba o Godziny",
      referral: "Poleć Znajomego",
      cover: "Zastępstwa",
      status: "Tablica Statusu",
      info: "Informacje",
      guide: "Jak używać",
      language: "Język",
    },
    footer: {
      tagline: "Napędzane przez AI (Harley)",
      copyright: "© 2024 SMART HARLEY TECHNOLOGIES",
      subtext: "Zaawansowany System Zarządzania Infrastrukturą",
    },
    language: {
      title: "Język Interfejsu",
      description: "Wybierz preferowany język dla matrycy CleanLink.",
      select: "Wybierz Język",
      back: "Powrót do Konsoli",
    },
    common: {
      submit: "Wyślij",
      loading: "Przetwarzanie...",
      site: "Miejsce",
      name: "Imię i Nazwisko",
      date: "Data",
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationPath = typeof translations.en;