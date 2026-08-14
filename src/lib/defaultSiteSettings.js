/**
 * Default site settings — mirrors every hardcoded value in the public pages.
 * When siteSettings doesn't exist in Firestore yet, these defaults ensure
 * zero visual regression.
 */
export const DEFAULT_SITE_SETTINGS = {
  orgInfo: {
    fullName: 'Centro de Recursos Educativos para Ciegos y Baja Vision A.C.',
    shortName: 'CRECIBV, A.C.',
    description: 'Centro de Rehabilitacion y Educacion para Ciegos y Debiles Visuales',
    address: {
      street: 'Calle Alferez 611',
      colony: 'Col. Real Providencia',
      city: 'Leon',
      state: 'Guanajuato',
      country: 'Mexico',
      full: 'Calle Alferez 611, Col. Real Providencia, Leon, Guanajuato, Mexico',
    },
    phone: '+52 477 201 7851',
    email: 'contacto@crecibv.com',
    hours: 'Lunes a Viernes, 9:00 AM - 2:00 PM',
  },

  hero: {
    title: 'BIENVENIDO A CRECIBV',
    ctaText: 'APOYAR',
    ctaLink: '/donaciones',
  },

  donationBanner: {
    text: 'Dona Hoy! Apoya a mejorar la calidad de vida de muchas personas.',
    ctaText: 'APOYAR',
  },

  donations: {
    sectionTitle1: 'HAZ TU',
    sectionTitle2: 'DONATIVO',
    beneficiaryName: 'CRECIBV - Centro de Recursos Educativos para Ciegos y Baja Vision A.C.',
    beneficiaryAddress:
      'Alferez No. 611, Colonia Real de Providencia, Leon de los Aldama, Guanajuato, Mexico. C.P. 37234.',
    awarenessMessage:
      'En el estado de Guanajuato la discapacidad visual es la segunda con mas poblacion que presenta esta discapacidad con un aproximado de 86,000 personas.',
    callToAction: '',
    bankName: 'BanBajio',
    clabe: '030225900028096394',
    bankLogoURL: '',
    donationImageURL: '',
  },

  socialMedia: [
    { platform: 'facebook', url: 'https://www.facebook.com/CrecibvAC', label: 'Facebook' },
    { platform: 'instagram', url: 'https://www.instagram.com/crecibv/', label: 'Instagram' },
    { platform: 'whatsapp', url: 'https://wa.me/524772017851', label: 'WhatsApp' },
  ],

  maps: {
    embedURL:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.315021407141!2d-101.67137812473648!3d21.136858284272185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bcad65409d9a7%3A0x1a8d7d8a6f136eb0!2sAlf%C3%A9rez%20611%2C%20Real%20Providencia%2C%2037234%20Le%C3%B3n%2C%20Gto.%2C%20M%C3%A9xico!5e0!3m2!1sen!2sus!4v1704974979174!5m2!1sen!2sus',
  },

  sectionTitles: {
    aboutUs: { line1: 'ACERCA DE', line2: 'NOSOTROS' },
    services: { line1: 'NUESTROS', line2: 'SERVICIOS' },
    contact: { line1: 'PONTE EN', line2: 'CONTACTO' },
    location: { line1: 'NUESTRA', line2: 'UBICACION' },
    donations: { line1: 'HAZ TU', line2: 'DONATIVO' },
  },

  seo: {
    title: 'CRECIBV - Centro de Recursos Educativos para Ciegos y Baja Vision',
    description:
      'Centro de Recursos Educativos para Ciegos y Baja Vision A.C. en Leon, Guanajuato.',
    ogImage: '',
  },
};
