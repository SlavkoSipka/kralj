import fs from 'fs';

const files = [
  'src/constants/villa4Apartments.ts',
  'src/components/Navigation.tsx',
  'src/pages/VillaApartments.tsx',
  'src/components/ApartmentCard.tsx',
  'src/components/ResortModal.tsx',
  'src/App.tsx',
  'src/constants/royalAquaApartments.ts',
  'src/pages/Location.tsx',
  'src/pages/Properties.tsx',
  'src/constants/index.ts',
  'src/pages/Villa4Apartments.tsx',
  'src/components/ThankYouModal.tsx',
  'src/components/Footer.tsx',
  'index.html',
  'src/pages/RoyalAquaApartments.tsx',
  'src/constants/apartments.ts',
  'src/components/LoadingScreen.tsx',
];

for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;

  s = s.replace(/(\/images\/[^"')]+?)\.(png|jpe?g)/gi, '$1.webp');

  s = s.replace(
    /(res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?!f_auto)([^"'\s)]+)/g,
    (m, p1, rest) => {
      if (rest.startsWith('f_auto') || rest.startsWith('f_webp')) return m;
      return `${p1}f_auto,q_auto,w_1920/${rest}`;
    }
  );

  if (s !== before) {
    fs.writeFileSync(f, s);
    console.log('updated', f);
  } else {
    console.log('no change', f);
  }
}
