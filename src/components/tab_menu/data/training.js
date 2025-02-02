import Storage from '../../../repository/storage';
let level = Storage.get('user').data.level ? Storage.get('user').data.level : '';
let grupName = Storage.get('user').data.grup_name ? Storage.get('user').data.grup_name : '';
export const Menu = 
level.toLowerCase() === 'client' && grupName.toLowerCase() === 'admin training' ?
[
    {
        label: 'My Company',
        subLabel:'Perusahaan',
        icon: 'company.svg',
        iconActive: 'company-active.svg',
        route: '/training'
    },
    {
        label: 'User',
        subLabel:'Pengguna',
        icon: 'users.svg',
        iconActive: 'users-active.svg',
        route: '/training/user'
    },
    {
        label: 'Membership',
        subLabel:'Keanggotaan',
        icon: 'membership.svg',
        iconActive: 'membership-active.svg',
        route: '/training/membership'
    },
    {
        label: 'Report',
        subLabel:'Laporan',
        icon: 'reports.svg',
        iconActive: 'reports-active.svg',
        route: '/training/report'
    }
]
: level.toLowerCase() === 'client' && grupName.toLowerCase() === 'user training' ?
[
    {
        label: 'Course',
        subLabel:'Materi',
        icon: 'n-plan.svg',
        iconActive: 'n-plan.svg',
        route: '/training/plan-user'
    },
    {
        label: 'Quiz',
        subLabel:'Latihan',
        icon: 'n-exam.svg',
        iconActive: 'n-exam.svg',
        route: '/training-user-dashboard-quiz'
    },
    {
        label: 'Exam',
        subLabel:'Ujian',
        icon: 'n-exam.svg',
        iconActive: 'n-exam.svg',
        route: '/training-user-dashboard'
    },
    {
        label: 'Membership',
        subLabel:'Keanggotaan',
        icon: 'n-membership.png',
        iconActive: 'n-membership.png',
        route: '/training/user-membership'
    },
]
: level.toLowerCase() === 'admin' ?
[
    {
        label: 'Company',
        subLabel:'Perusahaan',
        icon: 'company.svg',
        iconActive: 'company-active.svg',
        route: '/training'
    },
    {
        label: 'User',
        subLabel:'Pengguna',
        icon: 'users.svg',
        iconActive: 'users-active.svg',
        route: '/training/user'
    },
    // {
    //     label: 'News',
    //     icon: 'news.svg',
    //     iconActive: 'news-active.svg',
    //     route: '/training'
    // },
    {
        label: 'Course',
        subLabel:'Materi',
        icon: 'theory.svg',
        iconActive: 'theory-active.svg',
        route: '/training/course'
    },
    {
        label: 'Live Class',
        subLabel:'Tatap Muka',
        icon: 'webinars.svg',
        iconActive: 'webinars-active.svg',
        route: '/training/webinar'
    },
    {
        label: 'Quiz',
        subLabel:'Latihan',
        icon: 'practice.svg',
        iconActive: 'practice-active.svg',
        route: '/training/quiz'
    },
    {
        label: 'Exam',
        subLabel:'Ujian',
        icon: 'exam.svg',
        iconActive: 'exam-active.svg',
        route: '/training/exam'
    },
    {
        label: 'Plan',
        subLabel:'Rencana',
        icon: 'learning-plan.svg',
        iconActive: 'learning-plan-active.svg',
        route: '/training/plan'
    },
    {
        label: 'Membership',
        subLabel:'Keanggotaan',
        icon: 'membership.svg',
        iconActive: 'membership-active.svg',
        route: '/training/membership'
    },
    {
        label: 'Report',
        subLabel:'Laporan',
        icon: 'reports.svg',
        iconActive: 'reports-active.svg',
        route: '/training/report'
    },
    {
        label: 'Questions',
        subLabel:'Pertanyaan',
        icon: 'questions.svg',
        iconActive: 'questions-active.svg',
        route: '/training/questions'
    },
    {
        label: 'Settings',
        subLabel:'Pengaturan',
        icon: 'settings.png',
        iconActive: 'settings-active.png',
        route: '/training/settings'
    }
]
: level.toLowerCase() === 'superadmin' ?
[
    {
        label: 'Quota',
        subLabel:'Kuota',
        icon: 'quota.svg',
        iconActive: 'quota-active.svg',
        route: '/training'
    },
    {
        label: 'Company',
        subLabel:'Perusahaan',
        icon: 'company.svg',
        iconActive: 'company-active.svg',
        route: '/training/company'
    },
    {
        label: 'User',
        subLabel:'Pengguna',
        icon: 'users.svg',
        iconActive: 'users-active.svg',
        route: '/training/user'
    },
    // {
    //     label: 'News',
    //     icon: 'news.svg',
    //     iconActive: 'news-active.svg',
    //     route: '/training'
    // },
    {
        label: 'Course',
        subLabel:'Materi',
        icon: 'theory.svg',
        iconActive: 'theory-active.svg',
        route: '/training/course'
    },
    {
        label: 'Live Class',
        subLabel:'Tatap Muka',
        icon: 'webinars.svg',
        iconActive: 'webinars-active.svg',
        route: '/training/webinar'
    },
    {
        label: 'Quiz',
        subLabel:'Latihan',
        icon: 'practice.svg',
        iconActive: 'practice-active.svg',
        route: '/training/quiz'
    },
    {
        label: 'Exam',
        subLabel:'Ujian',
        icon: 'exam.svg',
        iconActive: 'exam-active.svg',
        route: '/training/exam'
    },
    {
        label: 'Plan',
        subLabel:'Rencana',
        icon: 'learning-plan.svg',
        iconActive: 'learning-plan-active.svg',
        route: '/training/plan'
    },
    {
        label: 'Membership',
        subLabel:'Keanggotaan',
        icon: 'membership.svg',
        iconActive: 'membership-active.svg',
        route: '/training/membership'
    },
    {
        label: 'Report',
        subLabel:'Laporan',
        icon: 'reports.svg',
        iconActive: 'reports-active.svg',
        route: '/training/report'
    },
    {
        label: 'Questions',
        subLabel:'Pertanyaan',
        icon: 'questions.svg',
        iconActive: 'questions-active.svg',
        route: '/training/questions'
    },
    {
        label: 'Settings',
        subLabel:'Pengaturan',
        icon: 'settings.png',
        iconActive: 'settings-active.png',
        route: '/training/settings'
    }
]
:
[
    {
        label: 'Course',
        subLabel:'Materi',
        icon: 'theory.svg',
        iconActive: 'theory-active.svg',
        route: '/training/course'
    }
]