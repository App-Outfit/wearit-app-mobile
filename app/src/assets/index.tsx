import { Icon } from 'react-native-elements';
import { lightTheme } from '../styles/theme';

type ImageSource = number; // React Native images are required as numbers
type AnimationSource = string; // Lottie animations are usually JSON objects

// Images
export const Images: Record<string, ImageSource> = {
    logo_wearit: require('./images/logo-wearit.png'),
};

// Icons
export const Icons: Record<string, ImageSource> = {};
export const circleCheckIcon = (
    <Icon
        name="checkmark-circle-outline"
        type="ionicon"
        iconProps={{ size: 24, name: 'checkmark-circle-outline' }}
        color={lightTheme.colors.primary}
    />
);
export const circleErrorIcon = (
    <Icon
        name="exclamationcircleo"
        type="antdesign"
        iconProps={{ size: 20, name: 'exclamationcircleo' }}
        color={lightTheme.colors.error}
        style={{ marginRight: 2 }}
    />
);
export const eyeIcon = (
    <Icon
        name="eye"
        type="antdesign"
        iconProps={{ size: 20, name: 'eye' }}
        color={lightTheme.colors.black}
        style={{ marginRight: 2 }}
    />
);
export const eyeOffIcon = (
    <Icon
        name="eye-off"
        type="antdesign"
        iconProps={{ size: 20, name: 'eye-off' }}
        color={lightTheme.colors.black}
        style={{ marginRight: 2 }}
    />
);

// Animations
export const Animations: Record<string, AnimationSource> = {
    loading_spinner: require('./lottie/lottie-loading-spinner.json'),
};

// Fonts

// Images SVG Brand
// import Adidas from './images/icons-brands/adidas.png'
// import Asos from './images/icons-brands/asos.png'
// import Bershka from './images/icons-brands/bershka.png'
// import Hm from './images/icons-brands/h&m.png'
// import Lacoste from './images/icons-brands/lacoste.png'
// import Mango from './images/icons-brands/mango.png'
// import Nike from './images/icons-brands/nike.png'
// import OffWhite from './images/icons-brands/off-white.png'
// import PullAndBear from './images/icons-brands/Pull-&-Bear.png'
// import Puma from './images/icons-brands/puma.png'
// import RickOwens from './images/icons-brands/rick-owens.png'
// import Stradivarius from './images/icons-brands/stradivarius.png'
// import Uniqlo from './images/icons-brands/uniqlo.png'
// import NorthFace from './images/icons-brands/the-north-face.png'
// import UrbanOutfitters from './images/icons-brands/urban-outfitters.png'
// import Zara from './images/icons-brands/zara.png'

// export const BrandIcons: Record<string, number> = {
//   adidas: Adidas,
//   asos: Asos,
//   bershka: Bershka,
//   hm: Hm,
//   lacoste: Lacoste,
//   mango: Mango,
//   nike: Nike,
//   'off-white': OffWhite,
//   'pull-and-bear': PullAndBear,
//   puma: Puma,
//   'rick-owens': RickOwens,
//   stradivarius: Stradivarius,
//   uniqlo: Uniqlo,
//   'the-north-face': NorthFace,
//   'urban-outfitters': UrbanOutfitters,
//   zara: Zara,
// };

export const BrandIcons: Record<string, number> = {
    adidas: require('./images/icons-brands/adidas.png'),
    asos: require('./images/icons-brands/asos.png'),
    bershka: require('./images/icons-brands/bershka.png'),
    'h&m': require('./images/icons-brands/h&m.png'),
    lacoste: require('./images/icons-brands/lacoste.png'),
    mango: require('./images/icons-brands/mango.png'),
    nike: require('./images/icons-brands/nike.png'),
    'off-white': require('./images/icons-brands/off-white.png'),
    'pull-and-bear': require('./images/icons-brands/Pull-&-Bear.png'),
    puma: require('./images/icons-brands/puma.png'),
    'rick-owens': require('./images/icons-brands/rick-owens.png'),
    stradivarius: require('./images/icons-brands/stradivarius.png'),
    uniqlo: require('./images/icons-brands/uniqlo.png'),
    'the-north-face': require('./images/icons-brands/the-north-face.png'),
    'urban-outfitters': require('./images/icons-brands/urban-outfitters.png'),
    zara: require('./images/icons-brands/zara.png'),
};
