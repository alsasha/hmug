import marketingBannerIcon from '../assets/marketingBannerIcon.svg'
import BannerIcon2 from '../assets/BannerIcon2.svg'
import BannerIcon3 from '../assets/BannerIcon3.svg'
import marketingBanner1 from '../assets/marketingBanner1.png'
import BannerPng2 from '../assets/BannerPng2.png'
import BannerPng3 from '../assets/BannerPng3.png'

export const banners = [
    {
        id: 1,
        title: 'The North Face',
        subtitle: 'Sponsored',
        icon: marketingBannerIcon,
        image: marketingBanner1
    },
    {
        id: 2,
        title: 'Wise',
        subtitle: 'Sponsored',
        icon: BannerIcon2,
        image: BannerPng2,
        backgroundColor: '#87EA5C',
        buttonColor: '#173300',
        titleColor: '#173300'
    },
    {
        id: 3,
        title: 'Chase Bank',
        subtitle: 'Sponsored',
        icon: BannerIcon3,
        image: BannerPng3,
        backgroundColor: '#126BC5',
        buttonColor: '#091736'
    },
];