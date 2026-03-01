import { motion } from "framer-motion";
import { Construction } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
            <Construction className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground max-w-md">
            {description || "Este módulo está em desenvolvimento e será disponibilizado em breve."}
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default PlaceholderPage;
