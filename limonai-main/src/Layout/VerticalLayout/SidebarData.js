const SidebarData = [
    {
        label: "Menu",
        isMainMenu: true,
    },
    {
        label: "Anasayfa",
        icon: "mdi mdi-home-variant-outline",
        url: "/dashboard",
        issubMenubadge: true,
        bgcolor: "bg-primary",
        badgeValue: "3"
    },
    {
        label: "Sohbet Et",
        icon: "mdi mdi-chat",
        isHasArrow: true,
        url: "/chat",
    },
    
    {
        label: "Yönetim",
        isMainMenu: true,
    },
    {
        label: 'Kullanıcı Ekle',
        icon: 'ri ri-user-add-fill',
        url:"/admin/create-user",
        
      },
      {
        label: 'Kullanıcı Listesi',
        icon: 'ri ri-contacts-fill',
        url:"/admin/list-users",
        
      },
      
    {
        label: "Sohbetleri gör",
        icon: "ri ri-discuss-fill",
        url:"/admin/chat-interactions",
    },
    {
        label: "Yardım",
        isMainMenu: true,
    },
    
    
    {
        label: "Nasıl Kullanılır?",
        icon: "mdi mdi-information",
        url:"/howto",
    },
]
export default SidebarData;