'use client';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popper from '@mui/material/Popper';
import ListItem from '@mui/material/ListItem';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useProducts } from 'src/hooks/firebase';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

export function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { products, loading } = useProducts({ isActive: true });

  // Filter products based on search query
  const suggestions = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6) // Limit to 6 suggestions
    : [];

  const handleSearch = (e?: React.FormEvent, selectedProduct?: any) => {
    if (e) e.preventDefault();

    if (selectedProduct) {
      router.push(paths.product(selectedProduct.slug || selectedProduct.id));
      setQuery('');
      setOpen(false);
    } else if (query.trim()) {
      router.push(`${paths.products}?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    } else {
      router.push(paths.products);
      setOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setOpen(value.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSearch(undefined, suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleClickAway = () => {
    setOpen(false);
    setSelectedIndex(-1);
  };

  // Close suggestions when navigating away
  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false);
      setSelectedIndex(-1);
    };

    return () => {
      handleRouteChange();
    };
  }, []);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <Box
          ref={anchorRef}
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            mx: 'auto',
            border: '1px solid',
            borderColor: open ? 'primary.main' : 'divider',
            borderRadius: 1,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            transition: 'border-color 0.2s',
          }}
        >
          <InputBase
            inputRef={inputRef}
            fullWidth
            placeholder="Search for components, boards, sensors..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setOpen(true)}
            startAdornment={
              <InputAdornment position="start" sx={{ pl: 1.5, pr: 0.5 }}>
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            endAdornment={
              loading && query.trim() ? (
                <InputAdornment position="end" sx={{ pr: 1 }}>
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null
            }
            sx={{ height: 44 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              height: 44,
              borderRadius: 0,
              boxShadow: 'none',
              px: 3,
            }}
          >
            Search
          </Button>
        </Box>

        {/* Search Suggestions Dropdown */}
        <Popper
          open={open && suggestions.length > 0}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          sx={{ width: anchorRef.current?.offsetWidth, zIndex: 1300 }}
        >
          <Paper
            elevation={8}
            sx={{
              mt: 0.5,
              maxHeight: 400,
              overflow: 'auto',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <List sx={{ py: 0.5 }}>
              {suggestions.map((product, index) => (
                <ListItem key={product.id} disablePadding>
                  <ListItemButton
                    selected={index === selectedIndex}
                    onClick={() => handleSearch(undefined, product)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      gap: 2,
                      '&.Mui-selected': {
                        bgcolor: 'action.selected',
                      },
                    }}
                  >
                    <Avatar
                      src={product.images?.[0]?.url}
                      alt={product.name}
                      variant="rounded"
                      sx={{ width: 48, height: 48 }}
                    >
                      <Iconify icon="solar:box-bold-duotone" width={24} />
                    </Avatar>
                    <ListItemText
                      primary={product.name}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {fCurrency(product.salePrice || product.price)}
                          </Typography>
                          {product.salePrice && product.salePrice < product.price && (
                            <Typography
                              variant="caption"
                              sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                            >
                              {fCurrency(product.price)}
                            </Typography>
                          )}
                        </Box>
                      }
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 500,
                        noWrap: true,
                      }}
                    />
                    <Iconify icon="eva:arrow-ios-forward-fill" sx={{ color: 'text.disabled' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {/* View all results footer */}
            {suggestions.length >= 6 && (
              <Box
                sx={{
                  p: 1.5,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.neutral',
                }}
              >
                <Button
                  fullWidth
                  variant="text"
                  color="primary"
                  onClick={(e) => handleSearch(e)}
                  endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                >
                  View all results for &quot;{query}&quot;
                </Button>
              </Box>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
