'use client';

import React from 'react';
import { FormControl, Select, MenuItem, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ModelSelect({ models = [], selectedModel, onChange, size = 'small', minWidth = 180 }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleModelChange = event => {
    if (!event || !event.target) return;
    const newModelId = event.target.value;

    // 找到选中的模型对象
    const selectedModelObj = models.find(model => model.id === newModelId);

    if (selectedModelObj) {
      // 将完整的模型信息存储到 localStorage
      localStorage.setItem('selectedModelInfo', JSON.stringify(selectedModelObj));
    } else {
      // 如果没有找到对应模型，则只存储ID
      localStorage.removeItem('selectedModelInfo');
    }

    // 通知父组件
    onChange?.(event);

    // 触发模型选择变化事件
    const modelChangeEvent = new CustomEvent('model-selection-changed');
    window.dispatchEvent(modelChangeEvent);
  };

  return (
    <FormControl size={size} sx={{ minWidth }}>
      <Select
        value={selectedModel}
        onChange={handleModelChange}
        displayEmpty
        variant="outlined"
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          borderRadius: '0.5rem',
          height: '2rem',
          '& .MuiSelect-icon': {
            color: 'text.secondary'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: '1px'
          },
          '& .MuiSelect-select': {
            paddingTop: '0.25rem',
            paddingBottom: '0.25rem',
            fontSize: '0.875rem'
          }
        }}
        MenuProps={{
          PaperProps: {
            elevation: 2,
            sx: { 
              mt: 1, 
              borderRadius: 1,
              boxShadow: 'var(--color-shadow-shadow-3)'
            }
          }
        }}
      >
        <MenuItem value="" disabled>
          {t('playground.selectModelFirst')}
        </MenuItem>
        {models
          .filter(m => {
            if (m.provider === 'Ollama') {
              return m.name && m.endpoint;
            } else {
              return m.name && m.endpoint && m.apiKey;
            }
          })
          .map(model => (
            <MenuItem 
              key={model.id} 
              value={model.id}
              sx={{
                fontSize: '0.875rem',
                py: 1,
                '&:hover': {
                  bgcolor: 'state.base.hover'
                },
                '&.Mui-selected': {
                  bgcolor: 'state.base.active',
                  '&:hover': {
                    bgcolor: 'state.base.active-hover'
                  }
                }
              }}
            >
              {model.provider}: {model.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
