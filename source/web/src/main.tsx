import * as React from 'react';
import * as ReactDOM from 'react-dom/client'
import App from './App'
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import {createTheme, MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import '@mantine/notifications/styles.css';

const theme = createTheme({
  /** Put your mantine theme override here */
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider
      theme={theme}
      defaultColorScheme="dark"
    >
      <Notifications/>
      <App/>
    </MantineProvider>
  </React.StrictMode>,
)
