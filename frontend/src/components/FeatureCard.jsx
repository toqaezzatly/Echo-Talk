import React from 'react';
import { MessageSquare, Lock, User} from "lucide-react"

const FeatureCard = ({ title, description, icon }) => {
  const getIcon = () => {
        switch(icon) {
            case "chat_bubble":
                return <MessageSquare className="h-8 w-8 mx-auto mb-4 text-primary" />;
            case "lock":
                return  <Lock className="h-8 w-8 mx-auto mb-4 text-primary"/>;
            case "person":
                return <User className="h-8 w-8 mx-auto mb-4 text-primary" />;
            default: return null;
        }
    }

    return (
    <div className="card bg-base-100 shadow-lg p-6 hover:scale-105 transition-all">
        {getIcon()}
      <h3 className="text-xl font-semibold mb-2 text-base-content">{title}</h3>
      <p className="text-base-content/70">{description}</p>
    </div>
  );
};

export default FeatureCard;