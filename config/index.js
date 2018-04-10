const CONFIG = {
  // port
  PORT: '9090',
  // user roles
  ROLE: {
    user: 1,
    administrator: 100,
  },
  // initial general setting
  GENERAL_INIT: {
    cats: {
      index: {
        primaryColor: '#00B8DE',
        secondaryColor: '#F8F7F2',
        layerBg: 'linear-gradient(135deg, rgba(255,255,255, 0.5) 0%, rgba(0,0,0,0) 50%)',
        title: ''
      },
      more: {
        primaryColor: '#EE3831',
        secondaryColor: '#FEE500',
        layerBg: 'url(/assets/images/bg-more.png) repeat center',
        title: 'GOING GOING GONE'
      },
      bio: {
        primaryColor: '#008BCC',
        secondaryColor: '#FEDD00',
        layerBg: 'url("/assets/images/bg-bio-1.png") no-repeat left top, url("/assets/images/bg-bio-2.png") no-repeat right bottom',
        title: 'THIS IS ME'
      },
      coding: {
        primaryColor: '#111111',
        secondaryColor: '#F4F5F0',
        layerBg: 'url("/assets/images/bg-coding.png") repeat center',
        title: '01000010'
      },
      design: {
        primaryColor: '#5F4B8B',
        secondaryColor: '#88B04B',
        layerBg: 'url("/assets/images/bg-design.png") repeat center',
        title: 'BEAUTY HUNT'
      },
      translation: {
        primaryColor: '#287558',
        secondaryColor: '#FFE5A5',
        layerBg: 'url("/assets/images/bg-translation.png") repeat center',
        title: '!@#$%^&*'
      },
      bytes: {
        primaryColor: '#C83773',
        secondaryColor: '#00B2A2',
        layerBg: 'url("/assets/images/bg-bytes.png") repeat center',
        title: 'A BYTE A DAY'
      },
      words: {
        primaryColor: '#61007D',
        secondaryColor: '#F6B700',
        layerBg: 'url("/assets/images/bg-words.png") repeat center',
        title: 'JIBBER JABBER'
      },
      blog: {
        primaryColor: '#EF6A00',
        secondaryColor: '#00AFD3',
        layerBg: 'url("/assets/images/bg-blog.png") repeat center',
        title: 'DAYS WITHOUT UPDATE'
      }
    }
  }
};

module.exports = CONFIG;