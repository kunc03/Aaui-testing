import Storage from '../../../repository/storage';
let level = Storage.get('user').data.level ? Storage.get('user').data.level : '';
let grupName = Storage.get('user').data.grup_name ? Storage.get('user').data.grup_name : '';
export const Menu = 
level.toLowerCase() === 'client' && grupName.toLowerCase() === 'admin training' ?
[
    {
        label: 'My Company',
        icon: 'company.svg',
        iconActive: 'company-active.svg',
        route: '/training'
    },
    {
        label: 'User',
        icon: 'users.svg',
        iconActive: 'users-active.svg',
        route: '/training/user'
    },
    {
        label: 'Membership',
        icon: 'membership.svg',
        iconActive: 'membership-active.svg',
        route: '/training/membership'
    },
    {
        label: 'Report',
        icon: 'reports.svg',
        iconActive: 'reports-active.svg',
        route: '/training/report'
    }
]
: level.toLowerCase() === 'client' && grupName.toLowerCase() === 'user training' ?
[
    {
        label: 'Course',
        icon: 'n-plan.svg',
        iconActive: 'n-plan.svg',
        route: '/training/plan-user'
    },
    {
        label: 'Quiz',
        icon: 'n-exam.svg',
        iconActive: 'n-exam.svg',
        route: '/training-user-dashboard-quiz'
    },
    {
        label: 'Exam',
        icon: 'n-exam.svg',
        iconActive: 'n-exam.svg',
        route: '/training-user-dashboard'
    },
    {
        label: 'Membership',
        icon: 'n-membership.png',
        iconActive: 'n-membership.png',
        route: '/training/user-membership'
    },
]
: level.toLowerCase() === 'admin' ?
[
    {
        label: 'Company',
        icon: 'company.svg',
        iconActive: 'company-active.svg',
        route: '/training'
    },
    {
        label: 'User',
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
        icon: 'theory.svg',
        iconActive: 'theory-active.svg',
        route: '/training/course'
    },
    {
        label: 'Live Class',
        icon: 'webinars.svg',
        iconActive: 'webinars-active.svg',
        route: '/training/webinar'
    },
    {
        label: 'Quiz',
        icon: 'practice.svg',
        iconActive: 'practice-active.svg',
        route: '/training/quiz'
    },
    {
        label: 'Exam',
        icon: 'exam.svg',
        iconActive: 'exam-active.svg',
        route: '/training/exam'
    },
    {
        label: 'Plan',
        icon: 'learning-plan.svg',
        iconActive: 'learning-plan-active.svg',
        route: '/training/plan'
    },
    {
        label: 'Membership',
        icon: 'membership.svg',
        iconActive: 'membership-active.svg',
        route: '/training/membership'
    },
    {
        label: 'Report',
        icon: 'reports.svg',
        iconActive: 'reports-active.svg',
        route: '/training/report'
    },
    {
        label: 'Questions',
        icon: 'questions.svg',
        iconActive: 'questions-active.svg',
        route: '/training/questions'
    },
    {
        label: 'Settings',
        icon: 'settings.png',
        iconActive: 'settings-active.png',
        route: '/training/settings'
    }
]
: level.toLowerCase() === 'superadmin' ?
[
    {
        label: 'Quota',
        icon: 'quota.svg',
        iconActive: 'quota-active.svg',
        route: '/training'
    },
    {
        label: 'Company',
        icon: 'company.svg',
        iconActive: 'company-active.svg',
        route: '/training/company'
    },
    {
        label: 'User',
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
        icon: 'theory.svg',
        iconActive: 'theory-active.svg',
        route: '/training/course'
    },
    {
        label: 'Live Class',
        icon: 'webinars.svg',
        iconActive: 'webinars-active.svg',
        route: '/training/webinar'
    },
    {
        label: 'Quiz',
        icon: 'practice.svg',
        iconActive: 'practice-active.svg',
        route: '/training/quiz'
    },
    {
        label: 'Exam',
        icon: 'exam.svg',
        iconActive: 'exam-active.svg',
        route: '/training/exam'
    },
    {
        label: 'Plan',
        icon: 'learning-plan.svg',
        iconActive: 'learning-plan-active.svg',
        route: '/training/plan'
    },
    {
        label: 'Membership',
        icon: 'membership.svg',
        iconActive: 'membership-active.svg',
        route: '/training/membership'
    },
    {
        label: 'Report',
        icon: 'reports.svg',
        iconActive: 'reports-active.svg',
        route: '/training/report'
    },
    {
        label: 'Questions',
        icon: 'questions.svg',
        iconActive: 'questions-active.svg',
        route: '/training/questions'
    },
    {
        label: 'Settings',
        icon: 'settings.png',
        iconActive: 'settings-active.png',
        route: '/training/settings'
    }
]
:
[
    {
        label: 'Course',
        icon: 'theory.svg',
        iconActive: 'theory-active.svg',
        route: '/training/course'
    }
]