import { Label } from '@gravity-ui/uikit';

export const SkillBadge = ({ skill, theme = "normal" }) => {
  return (
    <Label theme={theme} className="mr-2 mb-2 font-medium">
      {skill}
    </Label>
  );
};
