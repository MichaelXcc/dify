'use client';

import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip, useTheme, Typography } from '@mui/material';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const theme = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh-CN' ? 'en' : 'zh-CN';
    i18n.changeLanguage(newLang);
  };

  return (
    <Tooltip title={i18n.language === 'zh-CN' ? 'Switch to English' : '切换到中文'}>
      <IconButton
        onClick={toggleLanguage}
        size="small"
        sx={{
          bgcolor: 'background.default',
          color: 'text.secondary',
          p: 1,
          borderRadius: '0.5rem',
          '&:hover': {
            bgcolor: 'state.base.hover',
            color: 'text.primary'
          },
          width: '2rem',
          height: '2rem'
        }}
      >
        <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
          {i18n.language === 'zh-CN' ? 'EN' : '中'}
        </Typography>
      </IconButton>
    </Tooltip>
  );
}
