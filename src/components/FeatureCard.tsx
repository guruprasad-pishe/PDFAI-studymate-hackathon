import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

const FeatureCard = ({ icon: Icon, title, description, iconColor = "text-primary" }: FeatureCardProps) => {
  return (
    <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-card hover:shadow-float transition-spring group cursor-pointer">
      <div className="flex flex-col items-start space-y-4">
        <div className={`w-12 h-12 rounded-lg bg-feature-card border border-border flex items-center justify-center group-hover:scale-110 transition-spring ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;