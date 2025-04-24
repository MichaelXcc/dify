'use client';

import { Box, Container, Typography, Button, useMediaQuery } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { styles } from '@/styles/home';
import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import { useTranslation } from 'react-i18next';

export default function HeroSection({ onCreateProject }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
      background: 'transparent'
    }}>
      {/* 添加粒子背景 */}
      {/* <ParticleBackground /> */}

      <Box sx={styles.decorativeCircle} />
      <Box sx={styles.decorativeCircleSecond} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          className='sticky top-0 z-10 flex flex-wrap items-center justify-between gap-y-2 bg-background-body pb-2 pt-4 leading-[56px]'
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="h1"
            fontWeight="600"
            sx={{
              color: 'text.primary',
              letterSpacing: '-0.5px',
            }}
          >
            {t('home.title')}
          </Typography>

          <Box 
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 }
            }}
          >
            <Button
              variant="text"
              size="medium"
              onClick={onCreateProject}
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                fontWeight: 500,
                fontSize: '0.875rem',
                px: 3,
                py: 1,
                height: '2rem',
                borderRadius: '0.75rem',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'background.hover',
                }
              }}
            >
              {t('home.createProject')}
            </Button>
            <Button
              variant="text"
              size="medium"
              onClick={() => {
                window.location.href = '/dataset-square';
              }}
              startIcon={<SearchIcon />}
              sx={{
                fontWeight: 500,
                fontSize: '0.875rem',
                px: 3,
                py: 1,
                height: '2rem',
                borderRadius: '0.75rem',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'background.hover',
                }
              }}
            >
              {t('home.searchDataset')}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
