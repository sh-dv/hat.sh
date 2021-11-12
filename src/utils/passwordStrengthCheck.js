import zxcvbn from "zxcvbn";
import { getTranslations as t} from "../../locales";

const passwordStrengthCheck = (password) => {
  let strength = {
    0: t('very_weak'),
    1: t('weak'),
    2: t('moderate'),
    3: t('good'),
    4: t('strong'),
  };

  let strengthResult = zxcvbn(password);

  return strength[strengthResult.score];
};

export default passwordStrengthCheck;
