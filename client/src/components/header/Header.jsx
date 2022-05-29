import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router';

export default function Header() {
  const [value, setValue] = React.useState('one');
  const navigate = useNavigate()

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue)
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab value="/newplan" label="Neuer Dienstplan" />
        <Tab value="/doctors" label="Ärzte" />
        <Tab value="/" label="Dienstpläne" />
      </Tabs>
    </Box>
  );
}
