import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    force: true,
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hook-form',
      '@hookform/resolvers',
      'yup',
      // MUI Core
      '@mui/material',
      '@mui/material/Stepper',
      '@mui/material/Step',
      '@mui/material/StepLabel',
      '@mui/material/TextField',
      '@mui/material/Button',
      '@mui/material/Card',
      '@mui/material/CardContent',
      '@mui/material/Typography',
      '@mui/material/Box',
      '@mui/material/Container',
      '@mui/material/Grid',
      '@mui/material/Paper',
      '@mui/material/Chip',
      '@mui/material/Avatar',
      '@mui/material/IconButton',
      '@mui/material/FormControl',
      '@mui/material/FormControlLabel',
      '@mui/material/Radio',
      '@mui/material/RadioGroup',
      '@mui/material/Checkbox',
      '@mui/material/Select',
      '@mui/material/MenuItem',
      '@mui/material/InputLabel',
      '@mui/material/Slider',
      '@mui/material/Alert',
      '@mui/material/AlertTitle',
      '@mui/material/LinearProgress',
      '@mui/material/Backdrop',
      '@mui/material/CircularProgress',
      '@mui/material/Dialog',
      '@mui/material/DialogTitle',
      '@mui/material/DialogContent',
      '@mui/material/DialogActions',
      // MUI Icons
      '@mui/icons-material/CheckCircle',
      '@mui/icons-material/ArrowForward',
      '@mui/icons-material/ArrowBack',
      '@mui/icons-material/Phone',
      '@mui/icons-material/Email',
      '@mui/icons-material/Home',
      '@mui/icons-material/Person',
      '@mui/icons-material/Family',
      '@mui/icons-material/AttachMoney',
      '@mui/icons-material/LocalHospital',
      '@mui/icons-material/Security',
      '@mui/icons-material/CalendarToday',
      '@mui/icons-material/ExpandMore',
      // Date Pickers
      '@mui/x-date-pickers/DatePicker',
      '@mui/x-date-pickers/LocalizationProvider',
      '@mui/x-date-pickers/AdapterDayjs',
      // Animation & SaasAble deps
      'framer-motion',
      'prop-types',
      // Utilities
      'dayjs',
      'dayjs/locale/en'
    ]
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          'react-libs': ['react-router-dom', 'react-hook-form', 'framer-motion'],
          'mui-core': [
            '@mui/material',
            '@emotion/react', 
            '@emotion/styled'
          ],
          'mui-components': [
            '@mui/material/Stepper',
            '@mui/material/TextField',
            '@mui/material/Button',
            '@mui/material/Card'
          ],
          'mui-icons': ['@mui/icons-material'],
          'mui-pickers': [
            '@mui/x-date-pickers',
            'dayjs'
          ],
          validation: ['yup', '@hookform/resolvers']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"development"'
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})