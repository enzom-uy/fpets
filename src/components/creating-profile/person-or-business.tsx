import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Building2,
  UserIcon as User,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

interface OptionProps {
  Icon: LucideIcon;
  iconSize?: number;
  strokeWidth?: number;
  title: string;
  description: string;
  value: "business" | "person";
  handleIsBusiness: (value: boolean) => void;
}

const Option: React.FC<OptionProps> = ({
  Icon,
  iconSize,
  title,
  description,
  strokeWidth,
  value,
  handleIsBusiness,
}) => {
  return (
    <Card
      className="flex justify-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-102 active:scale-95 active:shadow-sm"
      onClick={() => handleIsBusiness(value === "business")}
    >
      <CardHeader className="flex justify-center">
        <div className="bg-secondary w-fit rounded-xl p-4">
          <Icon size={iconSize} strokeWidth={strokeWidth || 1.5} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xl pb-2">{title}</p>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

interface Props {
  handleIsBusiness: (value: boolean) => void;
}

export const PersonOrBusiness: React.FC<Props> = ({ handleIsBusiness }) => {
  return (
    <div className="flex flex-col gap-4">
      <Option
        Icon={User}
        iconSize={56}
        title="Soy una Persona"
        description="Busco atención veterinaria para mis mascotas"
        value="person"
        handleIsBusiness={handleIsBusiness}
      />

      <Option
        Icon={Building2}
        iconSize={56}
        title="Soy un Negocio"
        description="Represento una veterinaria u otro servicio para mascotas"
        value="business"
        handleIsBusiness={handleIsBusiness}
      />
    </div>
  );
};
