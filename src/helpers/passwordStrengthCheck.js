import zxcvbn from "zxcvbn";

const passwordStrengthCheck = (password) => {
  let strength = {
    0: "Very Weak (guessable)",
    1: "Weak (guessable)",
    2: "moderate",
    3: "Good",
    4: "Strong",
  };

  let strengthResult = zxcvbn(password);

  return strength[strengthResult.score];
};

export default passwordStrengthCheck;
