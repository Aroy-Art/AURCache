import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const IconDashboard: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8.5 9.91668L11.3333 7.08334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.36567 13.4583C1.74391 12.3815 1.41655 11.16 1.4165 9.91661C1.41646 8.6732 1.74372 7.45167 2.3654 6.37483C2.98708 5.29798 3.88127 4.40376 4.95809 3.78204C6.03491 3.16032 7.25642 2.83301 8.49984 2.83301C9.74325 2.83301 10.9648 3.16032 12.0416 3.78204C13.1184 4.40376 14.0126 5.29798 14.6343 6.37483C15.256 7.45167 15.5832 8.6732 15.5832 9.91661C15.5831 11.16 15.2558 12.3815 14.634 13.4583" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconPackages: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#aur-clip)">
      <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.00016 6.66668H2.66683C2.31321 6.66668 1.97407 6.5262 1.72402 6.27615C1.47397 6.0261 1.3335 5.68697 1.3335 5.33334V2.66668C1.3335 2.31305 1.47397 1.97392 1.72402 1.72387C1.97407 1.47382 2.31321 1.33334 2.66683 1.33334H13.3335C13.6871 1.33334 14.0263 1.47382 14.2763 1.72387C14.5264 1.97392 14.6668 2.31305 14.6668 2.66668V5.33334C14.6668 5.68697 14.5264 6.0261 14.2763 6.27615C14.0263 6.5262 13.6871 6.66668 13.3335 6.66668H13.0002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.00016 9.33333H2.66683C2.31321 9.33333 1.97407 9.4738 1.72402 9.72385C1.47397 9.9739 1.3335 10.313 1.3335 10.6667V13.3333C1.3335 13.687 1.47397 14.0261 1.72402 14.2761C1.97407 14.5262 2.31321 14.6667 2.66683 14.6667H13.3335C13.6871 14.6667 14.0263 14.5262 14.2763 14.2761C14.5264 14.0261 14.6668 13.687 14.6668 13.3333V10.6667C14.6668 10.313 14.5264 9.9739 14.2763 9.72385C14.0263 9.4738 13.6871 9.33333 13.3335 9.33333H13.0002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 4H4.00813" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 12H4.00813" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.4667 8.93334L9.8667 8.73334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.1332 7.26667L5.5332 7.06667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.06689 10.4667L7.26689 9.86667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.06647 10.4667L8.7998 9.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.19977 6.20001L6.93311 5.53334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.5332 9.06667L6.19987 8.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.7998 7.2L10.4665 6.93333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.9334 5.53334L8.7334 6.13334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="aur-clip">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export const IconBuilds: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#builds-clip)">
      <path d="M14.9598 4.53333L10.6744 1.65749C10.4488 1.50426 10.1838 1.41941 9.9111 1.41313C9.63845 1.40684 9.36977 1.4794 9.13734 1.62208L2.08942 5.95708C1.88395 6.08382 1.71427 6.26098 1.5965 6.47173C1.47873 6.68247 1.41677 6.91982 1.41651 7.16124V11.2837C1.41616 11.5158 1.47282 11.7444 1.5815 11.9494C1.69019 12.1544 1.84758 12.3296 2.03984 12.4596L6.32526 15.3425C6.55087 15.4957 6.81592 15.5806 7.08857 15.5869C7.36123 15.5931 7.62991 15.5206 7.86234 15.3779L14.9103 11.0429C15.1157 10.9162 15.2854 10.739 15.4032 10.5283C15.5209 10.3175 15.5829 10.0802 15.5832 9.83874V5.70916C15.5835 5.47711 15.5269 5.24852 15.4182 5.04349C15.3095 4.83847 15.1521 4.66328 14.9598 4.53333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.08333 15.5833V9.91668L1.59375 6.48126" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.0835 9.91667L15.4206 5.05042" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="builds-clip">
        <rect width="17" height="17" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export const IconActivity: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21.4998 37.625C29.4159 37.625 35.8332 31.2078 35.8332 23.2917C35.8332 15.3756 29.4159 8.95834 21.4998 8.95834C13.5838 8.95834 7.1665 15.3756 7.1665 23.2917C7.1665 31.2078 13.5838 37.625 21.4998 37.625Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.5 16.125V23.2917L25.0833 26.875" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.9585 5.375L3.5835 10.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M39.4165 10.75L34.0415 5.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.4307 33.5042L7.1665 37.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M31.605 33.4504L35.8333 37.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconSettings: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.92819 1H7.59818C7.20036 1 6.81883 1.15804 6.53752 1.43934C6.25622 1.72064 6.09818 2.10218 6.09818 2.5V2.635C6.09792 2.89804 6.02848 3.15639 5.89684 3.38413C5.7652 3.61186 5.57599 3.80098 5.34818 3.9325L5.02569 4.12C4.79766 4.25165 4.53899 4.32096 4.27568 4.32096C4.01238 4.32096 3.75371 4.25165 3.52568 4.12L3.41318 4.06C3.06898 3.86145 2.66006 3.80758 2.27619 3.91023C1.89231 4.01288 1.56485 4.26365 1.36569 4.6075L1.20069 4.8925C1.00213 5.2367 0.948268 5.64562 1.05092 6.0295C1.15356 6.41338 1.40434 6.74084 1.74819 6.94L1.86069 7.015C2.08739 7.14588 2.2759 7.33382 2.40747 7.56012C2.53905 7.78643 2.60911 8.04323 2.61069 8.305V8.6875C2.61173 8.95182 2.54292 9.21171 2.41122 9.44088C2.27951 9.67005 2.08959 9.86034 1.86069 9.9925L1.74819 10.06C1.40434 10.2592 1.15356 10.5866 1.05092 10.9705C0.948268 11.3544 1.00213 11.7633 1.20069 12.1075L1.36569 12.3925C1.56485 12.7363 1.89231 12.9871 2.27619 13.0898C2.66006 13.1924 3.06898 13.1386 3.41318 12.94L3.52568 12.88C3.75371 12.7483 4.01238 12.679 4.27568 12.679C4.53899 12.679 4.79766 12.7483 5.02569 12.88L5.34818 13.0675C5.57599 13.199 5.7652 13.3881 5.89684 13.6159C6.02848 13.8436 6.09792 14.102 6.09818 14.365V14.5C6.09818 14.8978 6.25622 15.2794 6.53752 15.5607C6.81883 15.842 7.20036 16 7.59818 16H7.92819C8.32601 16 8.70754 15.842 8.98885 15.5607C9.27015 15.2794 9.42819 14.8978 9.42819 14.5V14.365C9.42846 14.102 9.49789 13.8436 9.62953 13.6159C9.76117 13.3881 9.95038 13.199 10.1782 13.0675L10.5007 12.88C10.7287 12.7483 10.9874 12.679 11.2507 12.679C11.514 12.679 11.7727 12.7483 12.0007 12.88L12.1132 12.94C12.4574 13.1386 12.8663 13.1924 13.2502 13.0898C13.6341 12.9871 13.9615 12.7363 14.1607 12.3925L14.3257 12.1C14.5242 11.7558 14.5781 11.3469 14.4755 10.963C14.3728 10.5791 14.122 10.2517 13.7782 10.0525L13.6657 9.9925C13.4368 9.86034 13.2469 9.67005 13.1152 9.44088C12.9834 9.21171 12.9146 8.95182 12.9157 8.6875V8.3125C12.9146 8.04818 12.9834 7.78829 13.1152 7.55912C13.2469 7.32995 13.4368 7.13966 13.6657 7.0075L13.7782 6.94C14.122 6.74084 14.3728 6.41338 14.4755 6.0295C14.5781 5.64562 14.5242 5.2367 14.3257 4.8925L14.1607 4.6075C13.9615 4.26365 13.6341 4.01288 13.2502 3.91023C12.8663 3.80758 12.4574 3.86145 12.1132 4.06L12.0007 4.12C11.7727 4.25165 11.514 4.32096 11.2507 4.32096C10.9874 4.32096 10.7287 4.25165 10.5007 4.12L10.1782 3.9325C9.95038 3.80098 9.76117 3.61186 9.62953 3.38413C9.49789 3.15639 9.42846 2.89804 9.42819 2.635V2.5C9.42819 2.10218 9.27015 1.72064 8.98885 1.43934C8.70754 1.15804 8.32601 1 7.92819 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.76318 10.75C9.00582 10.75 10.0132 9.74264 10.0132 8.5C10.0132 7.25736 9.00582 6.25 7.76318 6.25C6.52054 6.25 5.51318 7.25736 5.51318 8.5C5.51318 9.74264 6.52054 10.75 7.76318 10.75Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconHelp: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5.17917 13.0472C6.53108 13.7407 8.08623 13.9286 9.56438 13.5769C11.0425 13.2252 12.3465 12.3572 13.2412 11.1292C14.136 9.90119 14.5628 8.39399 14.4446 6.87918C14.3264 5.36438 13.6711 3.94159 12.5967 2.8672C11.5223 1.79282 10.0995 1.1375 8.58472 1.01932C7.06991 0.901145 5.56271 1.32789 4.33471 2.22266C3.1067 3.11743 2.23866 4.42137 1.88699 5.89952C1.53533 7.37767 1.72317 8.93282 2.41667 10.2847L1 14.4639L5.17917 13.0472Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.02246 5.25556C6.18899 4.78216 6.51769 4.38297 6.95035 4.1287C7.383 3.87442 7.89168 3.78148 8.38629 3.86632C8.88091 3.95115 9.32954 4.20831 9.65272 4.59223C9.97591 4.97615 10.1528 5.46206 10.152 5.96389C10.152 7.38056 8.02704 8.08889 8.02704 8.08889" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconLogo: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20.1667 39.8383C20.7241 40.1602 21.3564 40.3296 22 40.3296C22.6436 40.3296 23.2759 40.1602 23.8333 39.8383L36.6667 32.505C37.2235 32.1835 37.686 31.7212 38.0078 31.1645C38.3296 30.6079 38.4993 29.9763 38.5 29.3333V14.6667C38.4993 14.0237 38.3296 13.3922 38.0078 12.8355C37.686 12.2788 37.2235 11.8165 36.6667 11.495L23.8333 4.16168C23.2759 3.83986 22.6436 3.67044 22 3.67044C21.3564 3.67044 20.7241 3.83986 20.1667 4.16168L7.33333 11.495C6.77648 11.8165 6.31396 12.2788 5.99218 12.8355C5.6704 13.3922 5.50066 14.0237 5.5 14.6667V29.3333C5.50066 29.9763 5.6704 30.6079 5.99218 31.1645C6.31396 31.7212 6.77648 32.1835 7.33333 32.505L20.1667 39.8383Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 40.3333V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.0498 12.8333L20.172 21.5123C20.7281 21.8321 21.3583 22.0004 21.9998 22.0004C22.6413 22.0004 23.2715 21.8321 23.8276 21.5123L37.9498 12.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.75 7.82834L30.25 17.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Tile icons (larger, for stat cards)
export const IconTilePackages: React.FC<IconProps> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M24 30C26.2091 30 28 28.2091 28 26C28 23.7909 26.2091 22 24 22C21.7909 22 20 23.7909 20 26C20 28.2091 21.7909 30 24 30Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M40 40C41.0609 40 42.0783 39.5786 42.8284 38.8284C43.5786 38.0783 44 37.0609 44 36V16C44 14.9391 43.5786 13.9217 42.8284 13.1716C42.0783 12.4214 41.0609 12 40 12H24.2C23.531 12.0066 22.8711 11.8452 22.2806 11.5308C21.6901 11.2163 21.1879 10.7588 20.82 10.2L19.2 7.8C18.8358 7.24694 18.3399 6.79296 17.757 6.47879C17.174 6.16463 16.5222 6.00011 15.86 6H8C6.93913 6 5.92172 6.42143 5.17157 7.17157C4.42143 7.92172 4 8.93913 4 10V36C4 37.0609 4.42143 38.0783 5.17157 38.8284C5.92172 39.5786 6.93913 40 8 40H40Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 26H34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 26H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconTileBuilds: React.FC<IconProps> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9.1665 12.8333V33C9.1665 33.4862 9.35966 33.9526 9.70348 34.2964C10.0473 34.6402 10.5136 34.8333 10.9998 34.8333H31.1665" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.70361 34.2962L20.1664 23.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M34.8332 38.5C36.8582 38.5 38.4998 36.8584 38.4998 34.8333C38.4998 32.8083 36.8582 31.1667 34.8332 31.1667C32.8081 31.1667 31.1665 32.8083 31.1665 34.8333C31.1665 36.8584 32.8081 38.5 34.8332 38.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.16667 12.8333C11.1917 12.8333 12.8333 11.1917 12.8333 9.16667C12.8333 7.14162 11.1917 5.5 9.16667 5.5C7.14162 5.5 5.5 7.14162 5.5 9.16667C5.5 11.1917 7.14162 12.8333 9.16667 12.8333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconTileClock: React.FC<IconProps> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21.4998 37.625C29.4159 37.625 35.8332 31.2078 35.8332 23.2917C35.8332 15.3756 29.4159 8.95834 21.4998 8.95834C13.5838 8.95834 7.1665 15.3756 7.1665 23.2917C7.1665 31.2078 13.5838 37.625 21.4998 37.625Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.5 16.125V23.2917L25.0833 26.875" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.9585 5.375L3.5835 10.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M39.4165 10.75L34.0415 5.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.4307 33.5042L7.1665 37.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M31.605 33.4504L35.8333 37.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
