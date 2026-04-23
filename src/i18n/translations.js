export const SUPPORTED_LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "ca", label: "Català" }
];

export const DEFAULT_LANGUAGE = "es";

export const translations = {
  es: {
    nav: {
      dashboard: "Panel",
      users: "Usuarios",
      teachers: "Monitores",
      activities: "Actividades",
      config: "Configuración",
      logout: "Cerrar sesión"
    },
    topbar: {
      menuOpen: "Abrir navegación",
      themeGroup: "Tema",
      themeLight: "Tema claro",
      themeDark: "Tema oscuro",
      profileRole: "Administrador",
      logout: "Cerrar sesión",
      searchDefault: "Buscar en TenFit...",
      searchUsersOrClasses: "Buscar usuarios o clases...",
      searchActivities: "Buscar actividades o monitores...",
      searchUsers: "Buscar usuarios por nombre o DNI...",
      searchTeachers: "Buscar monitores por nombre o especialidad...",
      searchEnrollments: "Buscar usuarios o actividades...",
      searchConfig: "Buscar en configuración..."
    },
    dashboard: {
      heroTitle: "El motor cinético",
      heroSubtitle: "Vista operativa diaria del gimnasio en tiempo real.",
      agendaTitle: "Próximas actividades",
      agendaCta: "Ver actividades",
      agendaEmptyTitle: "Sin sesiones próximas",
      agendaEmptyDescription: "No hay actividades futuras disponibles en el backend.",
      sessionTeacher: "Monitor {name}",
      quickactionsTitle: "Acciones rápidas",
      quickactionsSubtitle: "Accede directamente a las secciones principales.",
      quickactionNewUser: "Nuevo socio",
      quickactionNewUserDesc: "Registrar alta en el sistema",
      quickactionNewActivity: "Nueva actividad",
      quickactionNewActivityDesc: "Publicar clase o taller",
      quickactionNewEnrollment: "Inscripción rápida",
      quickactionNewEnrollmentDesc: "Apuntar socio a una clase",
      quickactionNewTeacher: "Nuevo monitor",
      quickactionNewTeacherDesc: "Dar de alta a un profesor",
      frontdeskTitle: "Último socio registrado",
      frontdeskRegistration: "Alta {year}",
      frontdeskRegistrationRecent: "Alta reciente",
      frontdeskNoteOne: "{count} socio registrado en total — {active} activos.",
      frontdeskNoteMany: "{count} socios registrados en total — {active} activos.",
      frontdeskEmptyTitle: "Sin socios",
      frontdeskEmptyDescription: "Todavía no hay socios registrados en el sistema.",
      errorTitle: "No se pudo cargar el panel principal",
      errorFallback: "No se pudo construir el panel principal con los datos reales.",
      retry: "Reintentar",
      statusActive: "Activo",
      statusInactive: "Inactivo"
    },
    login: {
      subtitle: "Panel de administración",
      email: "Correo electrónico",
      password: "Contraseña",
      submit: "Iniciar sesión",
      submitting: "Accediendo...",
      error: "Credenciales incorrectas. Revisa el correo y la contraseña.",
      hint: "Acceso restringido al personal autorizado del gimnasio."
    },
    config: {
      title: "Configuración",
      subtitle: "Personaliza la apariencia y tus preferencias.",
      appearanceTitle: "Apariencia",
      appearanceNote: "El tema se cambia desde la barra superior.",
      languageTitle: "Idioma",
      languageNote: "Selecciona el idioma en el que se mostrará el panel.",
      languageLabel: "Idioma de la interfaz"
    },
    notFound: {
      title: "No hemos encontrado esta vista",
      description: "La ruta solicitada no existe dentro del panel interno de TenFit.",
      action: "Volver al panel"
    }
  },
  en: {
    nav: {
      dashboard: "Dashboard",
      users: "Members",
      teachers: "Instructors",
      activities: "Activities",
      config: "Settings",
      logout: "Sign out"
    },
    topbar: {
      menuOpen: "Open navigation",
      themeGroup: "Theme",
      themeLight: "Light theme",
      themeDark: "Dark theme",
      profileRole: "Administrator",
      logout: "Sign out",
      searchDefault: "Search in TenFit...",
      searchUsersOrClasses: "Search members or classes...",
      searchActivities: "Search activities or instructors...",
      searchUsers: "Search members by name or ID...",
      searchTeachers: "Search instructors by name or specialty...",
      searchEnrollments: "Search members or activities...",
      searchConfig: "Search in settings..."
    },
    dashboard: {
      heroTitle: "The kinetic engine",
      heroSubtitle: "Daily operational view of the gym in real time.",
      agendaTitle: "Upcoming activities",
      agendaCta: "View activities",
      agendaEmptyTitle: "No upcoming sessions",
      agendaEmptyDescription: "No future activities available on the backend.",
      sessionTeacher: "Instructor {name}",
      quickactionsTitle: "Quick actions",
      quickactionsSubtitle: "Jump straight to the main sections.",
      quickactionNewUser: "New member",
      quickactionNewUserDesc: "Register a new sign-up",
      quickactionNewActivity: "New activity",
      quickactionNewActivityDesc: "Publish a class or workshop",
      quickactionNewEnrollment: "Quick enrollment",
      quickactionNewEnrollmentDesc: "Sign a member into a class",
      quickactionNewTeacher: "New instructor",
      quickactionNewTeacherDesc: "Onboard a teacher",
      frontdeskTitle: "Latest member registered",
      frontdeskRegistration: "Joined {year}",
      frontdeskRegistrationRecent: "Recently joined",
      frontdeskNoteOne: "{count} member registered in total — {active} active.",
      frontdeskNoteMany: "{count} members registered in total — {active} active.",
      frontdeskEmptyTitle: "No members",
      frontdeskEmptyDescription: "There are no members registered in the system yet.",
      errorTitle: "Could not load the main dashboard",
      errorFallback: "Could not build the main dashboard with real data.",
      retry: "Retry",
      statusActive: "Active",
      statusInactive: "Inactive"
    },
    login: {
      subtitle: "Admin panel",
      email: "Email",
      password: "Password",
      submit: "Sign in",
      submitting: "Signing in...",
      error: "Wrong credentials. Check your email and password.",
      hint: "Restricted access for authorized gym staff only."
    },
    config: {
      title: "Settings",
      subtitle: "Customize the appearance and your preferences.",
      appearanceTitle: "Appearance",
      appearanceNote: "The theme is switched from the top bar.",
      languageTitle: "Language",
      languageNote: "Pick the language used to render the panel.",
      languageLabel: "Interface language"
    },
    notFound: {
      title: "We couldn't find this view",
      description: "The requested route does not exist inside the TenFit admin panel.",
      action: "Back to dashboard"
    }
  },
  ca: {
    nav: {
      dashboard: "Tauler",
      users: "Usuaris",
      teachers: "Monitors",
      activities: "Activitats",
      config: "Configuració",
      logout: "Tanca la sessió"
    },
    topbar: {
      menuOpen: "Obre la navegació",
      themeGroup: "Tema",
      themeLight: "Tema clar",
      themeDark: "Tema fosc",
      profileRole: "Administrador",
      logout: "Tanca la sessió",
      searchDefault: "Cerca a TenFit...",
      searchUsersOrClasses: "Cerca usuaris o classes...",
      searchActivities: "Cerca activitats o monitors...",
      searchUsers: "Cerca usuaris per nom o DNI...",
      searchTeachers: "Cerca monitors per nom o especialitat...",
      searchEnrollments: "Cerca usuaris o activitats...",
      searchConfig: "Cerca a la configuració..."
    },
    dashboard: {
      heroTitle: "El motor cinètic",
      heroSubtitle: "Vista operativa diària del gimnàs en temps real.",
      agendaTitle: "Pròximes activitats",
      agendaCta: "Mira les activitats",
      agendaEmptyTitle: "Sense sessions properes",
      agendaEmptyDescription: "No hi ha activitats futures disponibles al backend.",
      sessionTeacher: "Monitor {name}",
      quickactionsTitle: "Accions ràpides",
      quickactionsSubtitle: "Accedeix directament a les seccions principals.",
      quickactionNewUser: "Nou soci",
      quickactionNewUserDesc: "Registra una alta al sistema",
      quickactionNewActivity: "Nova activitat",
      quickactionNewActivityDesc: "Publica una classe o taller",
      quickactionNewEnrollment: "Inscripció ràpida",
      quickactionNewEnrollmentDesc: "Apunta un soci a una classe",
      quickactionNewTeacher: "Nou monitor",
      quickactionNewTeacherDesc: "Dóna d'alta un professor",
      frontdeskTitle: "Últim soci registrat",
      frontdeskRegistration: "Alta {year}",
      frontdeskRegistrationRecent: "Alta recent",
      frontdeskNoteOne: "{count} soci registrat en total — {active} actius.",
      frontdeskNoteMany: "{count} socis registrats en total — {active} actius.",
      frontdeskEmptyTitle: "Sense socis",
      frontdeskEmptyDescription: "Encara no hi ha socis registrats al sistema.",
      errorTitle: "No s'ha pogut carregar el tauler principal",
      errorFallback: "No s'ha pogut construir el tauler principal amb dades reals.",
      retry: "Torna-ho a provar",
      statusActive: "Actiu",
      statusInactive: "Inactiu"
    },
    login: {
      subtitle: "Tauler d'administració",
      email: "Correu electrònic",
      password: "Contrasenya",
      submit: "Inicia la sessió",
      submitting: "Accedint...",
      error: "Credencials incorrectes. Revisa el correu i la contrasenya.",
      hint: "Accés restringit al personal autoritzat del gimnàs."
    },
    config: {
      title: "Configuració",
      subtitle: "Personalitza l'aparença i les teves preferències.",
      appearanceTitle: "Aparença",
      appearanceNote: "El tema es canvia des de la barra superior.",
      languageTitle: "Idioma",
      languageNote: "Tria l'idioma amb què es mostrarà el tauler.",
      languageLabel: "Idioma de la interfície"
    },
    notFound: {
      title: "No hem trobat aquesta vista",
      description: "La ruta sol·licitada no existeix dins del tauler intern de TenFit.",
      action: "Torna al tauler"
    }
  }
};
