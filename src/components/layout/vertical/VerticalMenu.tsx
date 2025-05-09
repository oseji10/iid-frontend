// MUI Imports
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@/@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@/@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@/@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@/@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@/@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@/@core/styles/vertical/menuSectionStyles'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)
const VerticalMenu = ({ scrollMenu }: { scrollMenu: (container: any, isPerfectScrollbar: boolean) => void })  => {
  // const VerticalMenu = dynamic(() => import('./VerticalMenu'), { ssr: false });

  // const router = useRouter();
  const theme = useTheme();
  const { isBreakpointReached, transitionDuration } = useVerticalNav();
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar;

 

  const role = "4";
  // console.log(role)
  //   // const token = Cookies.get('authToken');

  //   if (!Cookies.get('authToken')) {
  //     router.push('/login');
  //     // return null;
  //   }

  // Function to check if a role can see a specific menu
  // const canView = (allowedRoles: string[]) => role && allowedRoles.includes(role);
  const canView = (allowedRoles: string[]) => role && (allowedRoles.includes(role) || role === '8');

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false),
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true),
          })}
    >
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className="ri-circle-line" /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <MenuSection label="Dashboard">
          {/* Menu items based on roles */}
          {canView(['2', '6']) && (
            <SubMenu label="Patients" icon={<i className="ri-user-settings-line" />}>
              <MenuItem href="/dashboard/patients">All Patients</MenuItem>
              {role ===   '6' && (
                <MenuItem href="/dashboard/encounters" icon={<i className="ri-shield-keyhole-line" />}>
                  Encounters
                </MenuItem>
              )}
            </SubMenu>
          )}

          {canView(['3']) && (
            <MenuItem href="/dashboard/appointments" icon={<i className="ri-calendar-line" />}>
              Appointments
            </MenuItem>
          )}

         




{canView(['4']) && (
         <MenuItem href='/dashboard/items' icon={<i className='ri-table-line' />}>
         Central Data Bank
       </MenuItem>
)}

{canView(['4']) && (
             <SubMenu label='Expression Extraction ' icon={<i className='ri-group-line' />}>
             <MenuItem href='/dashboard/inspection-extraction'>
               All Extracts
             </MenuItem>
             <MenuItem href='/dashboard/inspection-extraction/new-extract'>
               New Extract
             </MenuItem>
           </SubMenu>
          )}
{canView(['4']) && (
        <MenuItem href='/dashboard/companies' icon={<i className='ri-home-office-line' />}>
        Companies
      </MenuItem>
)}

{canView(['4']) && (
        <MenuItem href='/dashboard/schedule-2' icon={<i className='ri-calendar-line' />}>
        Schedule II
      </MenuItem>
)}
{canView(['4']) && (
        <MenuItem href='#' icon={<i className='ri-mac-line' />}>
        Industrial Data
      </MenuItem>
)}

{canView(['4']) && (
            <MenuItem href='#' icon={<i className='ri-hand-heart-line' />}>
            Evaluation
          </MenuItem>
)}

{canView(['4']) && (
            <MenuItem href='#' icon={<i className='ri-file-chart-line' />}>
            Reports
          </MenuItem>
)}

{canView(['4']) && (
            <MenuItem href='#' icon={<i className='ri-line-chart-line' />}>
            Data Analytics
          </MenuItem>
)}



{canView(['7']) && (
     <SubMenu label='Medicines' icon={<i className='ri-capsule-line' />}>
     <MenuItem href='/dashboard/medicines/new-medicine'>
       New Medicine
     </MenuItem>
     <MenuItem href='/dashboard/medicines'>
       All Medicines
     </MenuItem>
     <MenuItem href='/dashboard/manufacturers/new-manufacturer'>
       New Manufacturer
     </MenuItem>
     <MenuItem href='/dashboard/manufacturers'>
       All Manufacturer
     </MenuItem>
   </SubMenu>
)}


{canView(['7']) && (
   <SubMenu label='HMOs' icon={<i className='ri-hospital-line' />}>
     <MenuItem href='/dashboard/hmos/new-hmo'>
       New HMO
     </MenuItem>
     <MenuItem href='/dashboard/hmos'>
       All HMOs
     </MenuItem>
   
   </SubMenu>
)}



         
          {canView(['2', '5', '6']) && (
            <SubMenu label="Inventory" icon={<i className="ri-stock-line" />}>
              <MenuItem href="#">Lenses</MenuItem>
              <MenuItem href="#">Frames</MenuItem>
              <MenuItem href="#">Accessories</MenuItem>
            </SubMenu>
          )}

      
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  );
};

export default VerticalMenu;
