import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SkinTypeSelector } from '@/components/SkinTypeSelector';

describe('SkinTypeSelector', () => {
  it('başlangıçta ilk cilt tipini (Kuru) gösterir', () => {
    render(<SkinTypeSelector onSelect={() => {}} />);

    expect(
      screen.getByRole('heading', { level: 3, name: /Kuru/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Kuru cilt tipiyle devam et/i }),
    ).toBeInTheDocument();
  });

  it('Sonraki butonu sıradaki cilt tipine geçer', async () => {
    const user = userEvent.setup();
    render(<SkinTypeSelector onSelect={() => {}} />);

    await user.click(screen.getByRole('button', { name: /Sonraki cilt tipi/i }));

    expect(
      screen.getByRole('heading', { level: 3, name: /Yağlı/i }),
    ).toBeInTheDocument();
  });

  it('Önceki butonu döngüsel — ilk konumdayken son cilt tipine sarar', async () => {
    const user = userEvent.setup();
    render(<SkinTypeSelector onSelect={() => {}} />);

    await user.click(screen.getByRole('button', { name: /Önceki cilt tipi/i }));

    expect(
      screen.getByRole('heading', { level: 3, name: /Karma/i }),
    ).toBeInTheDocument();
  });

  it('Devam et butonu tıklanınca onSelect aktif cilt tipi ile çağrılır (onay sonrası)', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<SkinTypeSelector onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: /Sonraki cilt tipi/i }));
    await user.click(
      screen.getByRole('button', { name: /Yağlı cilt tipiyle devam et/i }),
    );

    await waitFor(() => expect(onSelect).toHaveBeenCalledWith('oily'));
  });

  it('Gösterge tab\'ı tıklanınca o cilt tipine atlar', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<SkinTypeSelector onSelect={onSelect} />);

    await user.click(screen.getByRole('tab', { name: 'Karma' }));

    expect(
      screen.getByRole('heading', { level: 3, name: /Karma/i }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Karma cilt tipiyle devam et/i }),
    );
    await waitFor(() =>
      expect(onSelect).toHaveBeenCalledWith('combination'),
    );
  });

  it('selected prop verilirse o cilt tipinden başlar', () => {
    render(<SkinTypeSelector onSelect={() => {}} selected="oily" />);

    expect(
      screen.getByRole('heading', { level: 3, name: /Yağlı/i }),
    ).toBeInTheDocument();
  });

  it('disabled iken navigasyon ve onSelect tetiklenmez', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<SkinTypeSelector onSelect={onSelect} disabled />);

    await user.click(screen.getByRole('button', { name: /Sonraki cilt tipi/i }));
    await user.click(
      screen.getByRole('button', { name: /Kuru cilt tipiyle devam et/i }),
    );

    expect(onSelect).not.toHaveBeenCalled();
  });
});
