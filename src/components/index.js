module.exports = {
    // Import For Header SideBar
    Header			: require('./Header_sidebar/Header').default,
    Loader			: require('./Header_sidebar/Loader').default,
    SideBar			: require('./Header_sidebar/Sidebar').default,

    // import component
    Login 			: require('./Login').default,
    Logout 			: require('./Logout').default,
    LoginVoucher	: require('./Login/index-v').default,
    Home			: require('./Home').default,
    Pengaturan      : require('./Pengaturan').default,
    Profile	        : require('./Profile').default,
	//Page404			: require('./404').default,
    
    // Import Users
	Users	        : require('./Users/User').default,
    UserAdd	        : require('./Users/User/add').default,
    UserEdit        : require('./Users/User/Edit').default,
    UserCabang      : require('./Users/UserCabang').default,
    UserGroup       : require('./Users/UserGroup').default,
}


/**
 * Login 
 * jek@jek.com
 * 123456
 */