import react from "react";
import { Search} from "lucide-react";
import { User } from "lucide-react";
import { ShoppingCart } from "lucide-react";
const SecondaryNav = () => {
    return (
        <nav className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end h-12 space-x-6">
            <Search className="w-5 h-5" />
            <User className="w-5 h-5" />
            <ShoppingCart className="w-5 h-5" />

        </div>
        </nav>
    );
};

export default SecondaryNav;