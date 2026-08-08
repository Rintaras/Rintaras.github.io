import { Project, Skill, TimelineEvent } from './types';

// デフォルト画像URL
const DEFAULT_PROJECT_IMAGE = 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Project';
export const PROFILE_IMAGE =
  'https://rintarasportfolio.s3.ap-northeast-1.amazonaws.com/S__67723271_0.jpg';
const DEFAULT_PROFILE_IMAGE = 'https://github.com/github.png';
const DEFAULT_EVENT_IMAGE = 'https://via.placeholder.com/200x200/374151/ffffff?text=Event';

/** Topa'z 公開元の原画像。`topaz.dev/_next/image` は外部埋め込みでキャッシュ・最適化の差が出やすいため直接 CDN を参照する */
const MOTION_DILE_COVER_IMAGE =
  'https://ptera-publish.topaz.dev/project/01KPHVHPFTE8EG67CDP0W1PXVQ.png?v=portfolio202604';

/** タイムライン用（イベント告知サムネ）。Projects カードとは別に Connpass 画像を使う */
const PROGATE_HACKATHON_2026_04_TIMELINE_IMAGE =
  'https://media.connpass.com/thumbs/91/16/91161c4216bb5770cdf99197d6847425.png';

export const projects: Project[] = [
  {
    id: 'motion-dile',
    title: 'Motion Dile（ワードウルフ3D版）',
    description: 'Progate Hackathon by AWS最終開催にて優秀賞を受賞。手でワニを操りながらAIが配った行動ミッションに沿って動く、人狼×モーション操作の新感覚パーティーゲームを開発しました。',
    image: MOTION_DILE_COVER_IMAGE,
    duration: '2026.04',
    role: 'アーキテクチャ設計・3D表現・UI実装',
    technologies: ['Vue', 'Three.js', 'Go', 'Redis', 'AWS', 'Terraform'],
    demoUrl: 'https://motiondile.net/',
    githubUrl: 'https://github.com/NUMaters/WaniAR',
    screenshots: [MOTION_DILE_COVER_IMAGE]
  },
  {
    id: 'ai-iot-device',
    title: 'AI搭載IoTデバイス',
    description: '大学の友人5名で全員ハッカソン初参加の中挑みました。慣れない短期開発、触れたことの無いAWS、初のIoT開発と様々な壁がある中、企業賞をいただくことができました。',
    image: 'https://topaz.dev/_next/image?url=https%3A%2F%2Fptera-publish.topaz.dev%2Fproject%2F01JEHDFZEVWFY0MSJXM5332F1V.png&w=3840&q=75',
    duration: '2024.12',
    role: 'ハッカソン開発',
    technologies: ['RasberryPi', 'Python', 'AWS IoTcore'],
    demoUrl: 'https://topaz.dev/projects/d07aaceab7659b8beb47',
    screenshots: [
      'https://via.placeholder.com/400x300/374151/ffffff?text=AI+IoT+Device'
    ]
  },
  {
    id: 'map-chat',
    title: 'Map Chat',
    description: '学生エンジニアコミュニティ発足以来初のメンバーでのハッカソン出場。全員が異なる大学や属性の中、記念すべき一つ目のプロダクトとなりました。',
    image: 'https://rintarasportfolio.s3.ap-northeast-1.amazonaws.com/MapChat.png',
    duration: '2025.01',
    role: 'フルスタック開発',
    technologies: ['React', 'Three.js', 'Go', 'FastAPI'],
    demoUrl: 'https://client-silk-gamma.vercel.app/',
    screenshots: [
      'https://rintarasportfolio.s3.ap-northeast-1.amazonaws.com/MapChat.png'
    ]
  },
  {
    id: 'tripmate',
    title: 'TripMate',
    description: '同学科内で行われた2024情報工学科ソフトウェアコンテストにて教員・学生の投票の結果、最優秀賞を受賞。自身初のチーム開発であり、得た学びが多くありました。',
    image: 'https://rintarasportfolio.s3.ap-northeast-1.amazonaws.com/TripMateImage.png',
    duration: '2025.02',
    role: 'リードデベロッパー',
    technologies: ['React', 'Python', 'FastAPI'],
    screenshots: [
      'https://rintarasportfolio.s3.ap-northeast-1.amazonaws.com/TripMateImage.png'
    ]
  },
  {
    id: 'Teamder',
    title: 'Teamder',
    description: '初めてのネイティブアプリ開発。技術を語り合ったり、共同開発を気軽に募集できるエンジニア同士のマッチングを目的としたアプリを開発しました。',
    image: 'https://topaz.dev/_next/image?url=https%3A%2F%2Fptera-publish.topaz.dev%2Fproject%2F01JPQKCCDN8HCNFG96E7WKB8TN.jpeg&w=3840&q=75',
    duration: '2025.03',
    role: 'リードデベロッパー',
    technologies: ['React-Native', 'Expo', 'AWS'],
    screenshots: [
      'https://rintarasportfolio.s3.ap-northeast-1.amazonaws.com/TripMateImage.png'
    ]
  }
];

export const skills: Skill[] = [
  // Languages
  { name: 'C', icon: 'code', category: 'language' },
  { name: 'Java', icon: 'code', category: 'language' },
  { name: 'Python', icon: 'code', category: 'language' },
  { name: 'PHP', icon: 'code', category: 'language' },
  { name: 'Go', icon: 'code', category: 'language' },
  { name: 'JavaScript', icon: 'code', category: 'language' },
  { name: 'TypeScript', icon: 'code', category: 'language' },
  { name: 'MySQL', icon: 'code', category: 'language' },
  { name: 'PostgreSQL', icon: 'code', category: 'language' },
  // Frameworks
  { name: 'React', icon: 'component', category: 'framework' },
  { name: 'FastAPI', icon: 'server', category: 'framework' },
  { name: 'Next.js', icon: 'server', category: 'framework' },
  { name: 'Three.js', icon: 'component', category: 'framework' },
  { name: 'Tailwind CSS', icon: 'component', category: 'framework' },
  { name: 'Vue', icon: 'component', category: 'framework' },
  { name: 'Django', icon: 'component', category: 'framework' },
  { name: 'Echo', icon: 'component', category: 'framework' },
  { name: 'Gin', icon: 'component', category: 'framework' },


  // Tools
  { name: 'AWS', icon: 'cloud', category: 'tool' },
  { name: 'Cloudflare', icon: 'cloud', category: 'tool' },
  { name: 'Docker', icon: 'container', category: 'tool' },
  { name: 'Redis', icon: 'cloud', category: 'tool' },
  { name: 'SupaBase', icon: 'code', category: 'tool' },
  { name: 'Vercel', icon: 'code', category: 'tool' },
  { name: 'Terraform', icon: 'code', category: 'tool' },

];

export const timelineEvents: TimelineEvent[] = [
  {
    year: '2022.April',
    title: '日本大学',
    description: '工学部情報工学科に入学',
    image: 'https://www.ce.nihon-u.ac.jp/nue/wp-content/uploads/2025/09/news_thumbnail.jpg',
    links: [
      {
        url: 'https://www.ce.nihon-u.ac.jp/computer-science/',
        label: '公式サイト'
      }
    ]
  },
  {
    year: '2024.October',
    title: 'MaTech',
    description: '学生エンジニア団体に加入する',
    image: 'https://dfs38zlnglmbd.cloudfront.net/assets/logo-520fec39.png',
    links: [
      {
        url: 'https://x.com/G8e8a',
        label: '公式X'
      }
    ]
  },
  {
    year: '2024.December',
    title: 'Progate Hackathon by AWS 2024.12 企業賞',
    description: 'ハッカソン初参加。AI搭載IoTデバイスを開発し企業賞を受賞',
    image: 'https://media.connpass.com/thumbs/89/30/893061def50d6db3b0b799171d78e678.png',
    links: [
      {
        url: 'https://topaz.dev/projects/d07aaceab7659b8beb47',
        label: 'Topa’z'
      }
    ]
  },
  {
    year: '2025.January',
    title: 'GeekCamp Hackathon vol.20',
    description: 'エンジニア交流アプリ「Map Chat」を開発',
    image: 'https://ferret-one.akamaized.net/images/6657f0fb5e4a0902870bf090/original.png?utime=1717039355',
    links: [
      {
        url: 'https://github.com/matthewTechCom/giikucamp20',
        label: 'GitHub'
      }
    ]
  },
  {
    year: '2025.February',
    title: '学内コンテスト 最優秀賞',
    description: '大学内ソフトウェアコンテストにて「TripMate」を開発し最優秀賞を受賞\n旅行に関する情報管理をAIによって最適化し、旅行計画を立てることができるアプリを開発しました。',
    image: 'https://rintarasportfolio.s3.ap-northeast-1.amazonaws.com/TripMate.png'
  },
  {
    year: '2025.March',
    title: 'Progate Hackathon by AWS 2025.03',
    description: 'エンジニアの技術の点に着目したマッチングアプリを開発',
    image: 'https://media.connpass.com/thumbs/4d/d6/4dd6e151c8549e2abe961286531a4b5f.png',
    links: [
      {
        url: 'https://topaz.dev/projects/55b22c80c6b909240cef',
        label: 'Topaz'
      }
    ]
  },
  {
    year: '2025.July',
    title: 'Progate Hackathon by AWS 2025.07',
    description: '学習サポート特化型のAIツールを開発',
    image: 'https://media.connpass.com/thumbs/da/65/da65409382a287a699383d33cf3c3419.png',
    links: [
      {
        url: 'https://topaz.dev/projects/5e95ab57f6578a013a8a',
        label: 'Topaz'
      }
    ]
  },
  {
    year: '2026.February ~ March',
    title: 'CyberAgent, Inc.(Online)',
    description: '同社開催「Go College」にてサーバーサイドの研修を受講し、基本文法からAPI実装、パフォーマンスチューニング等を学びました。',
    image: 'https://img.neirong.plus/o/44/16/441606706a6511efb2bf7515a302c126.png',
    links: [
      {
        url: 'https://note.com/ca_tech/n/n273b9a2f8055',
        label: '公式レポート'
      }
    ]
  },
  {
    year: '2026.February',
    title: '学内コンテスト 最優秀賞',
    description: '大学内ソフトウェアコンテストにて「NU App」を開発し最優秀賞を受賞。\n同大学のポータルサイトをより良く多機能にアップデートし、ios/android対応のネイティブアプリ開発を行いました。',
    image: 'https://pbs.twimg.com/media/HBkjGQ8bUAIBvw1?format=jpg&name=large',
    links: [
      {
        url: 'https://x.com/nihonuniv_ce_cs/status/2024688101160042620?s=20',
        label: '公式X'
      }
    ]
  },
  {
    year: '2026.February ~ March',
    title: 'CyberAgent, Inc.(Offline)',
    description: '同社開催「Go College」にて仕様書からAPI実装、リアーキテクチャ設計、ボトルネックの解消を行いました。',
    image: 'https://img.neirong.plus/o/44/16/441606706a6511efb2bf7515a302c126.png',
    links: [
      {
        url: 'https://note.com/ca_tech/n/n273b9a2f8055',
        label: '公式レポート'
      }
    ]
  },
  {
    year: '2026.March',
    title: 'Findy Campus Hackathon 2026.03 企業賞',
    description: 'エントリーエンジニア向けプラットフォーム「Hack Splinter」を開発し企業賞',
    image: 'https://directs.xsrv.jp/wp-content/uploads/2025/07/Findy.png',
    links: [
      {
        url: 'https://x.com/ayamakkie/status/2034962401490346375?s=20',
        label: '懇親会の様子(X引用)'
      }
    ]
  },
  {
    year: '2026.April',
    title: '日本大学大学院',
    description: ' 工学研究科　情報工学専攻　修士課程入学。ネットワーク分野にて研究を継続',
    image: 'https://www.ce.nihon-u.ac.jp/nue/wp-content/uploads/2025/09/news_thumbnail.jpg',
  },
  {
    year: '2026.April',
    title: 'Progate Hackathon by AWS 最終ver 2026.04 優秀賞',
    description: 'AWS Loft Up Tokyo会場での最終開催のProgate Hackathon by AWSにて「Motion Dile（ワードウルフ3D版）」を開発し優秀賞を受賞',
    image: PROGATE_HACKATHON_2026_04_TIMELINE_IMAGE,
    links: [
      {
        url: 'https://topaz.dev/projects/bb9937d83b6d3452339f',
        label: "Topa'z"
      },
      {
        url: 'https://progate.connpass.com/event/386402/',
        label: 'Connpass'
      }
    ]
  },
  {
    year: '2026.June',
    title: 'CyberAgent, Inc.',
    description: 'CA Tech JobにてサーバーサイドエンジニアとしてColorful Paletteの新規プロジェクトに参画し、新規機能開発や社内向けツールの開発に従事',
    image: 'https://img.neirong.plus/o/44/16/441606706a6511efb2bf7515a302c126.png',
    links: [
      {
        url: 'https://www.cyberagent.co.jp/careers/students/event/detail/id=32004',
        label: '公式サイト'
      }
    ],
  },
  {
    year: '2026.June ~',
    title: 'SCIEN, Inc.',
    description: '東大 松尾研発AIスタートアップにて長期インターン。受託開発のプロジェクトにて機械学習エンジニア、バックエンドエンジニアとして就業中。',
    image: 'https://pbs.twimg.com/profile_images/1894733318588858368/4XN-6jYz_400x400.jpg',
    links: [
      {
        url: 'https://scieninc.jp/',
        label: '公式サイト'
      }
    ],
  },
  {
    year: '2026.July',
    title: '3-shake Inc.',
    description: 'SREワークショップへ参加し、クラウドネイティブな技術を学ぶ',
    image: 'https://d2v9k5u4v94ulw.cloudfront.net/assets/images/5076589/original/a8f69e0b-b288-47a2-b3e2-59b059ef3c53?1590468986',
    links: [
      {
        url: 'https://3-shake.com/',
        label: '公式サイト'
      }
    ],
  },
  {
    year: '2026.July',
    title: 'HackBase@Nihon University 2026.07 企業賞x2',
    description: '日本大学の学部横断で行われたハッカソンにてバックエンド領域を担当し企業賞を2つ獲得',
    image: 'https://www.ce.nihon-u.ac.jp/nue/wp-content/uploads/2025/09/news_thumbnail.jpg',
    links: [
      {
        url: 'https://docs.google.com/presentation/d/1BJdT8LW60LNf4EntFiq3m35-9fJBVcrNQ0BpVA40JwU/edit?usp=sharing',
        label: "発表スライド"
      },
      {
        url: 'https://tech-boost-hackathon.my.canva.site/hackbase-nihon-university',
        label: '公式ページ'
      }
    ]
  },
  {
    year: '2026.August',
    title: 'MEDIA DO Co., Ltd.',
    description: '電子書籍の配信・管理を支えるシステムのインターンへ参加。システムのパフォーマンスチューニングに取り組みました。',
    image: 'https://mediado.jp/wp-content/themes/basic-theme/img/common/logo_ogp.png',
    links: [
      {
        url: 'https://mediado.jp/',
        label: '公式サイト'
      }
    ],
  },
  {
    year: '2026.August',
    title: 'Studist Corporation',
    description: '当社サービス「Teachme Biz」を主とした4Daysインターンへ参加。画像・動画を用いたAI新機能開発を行いました。',
    image: 'https://assets.st-note.com/production/uploads/images/223775137/profile_57663ddd4bad4e272a8feb20afc36346.jpg?fit=bounds&format=jpeg&quality=85&width=330',
    links: [
      {
        url: 'https://studist.jp',
        label: '公式サイト'
      }
    ],
  }
];
