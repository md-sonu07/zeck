import {
    Loader2, Plus, List, Image as ImageIcon, Upload, X, Trash2, EyeOff,
    ExternalLink, Edit, Search, FileText, ArrowLeft, Download, Save,
    PlusCircle, ChevronLeft, Eye, Users, Sparkles
} from 'lucide-react';

const iconMap = {
    loader: Loader2,
    plus: Plus,
    list: List,
    image: ImageIcon,
    upload: Upload,
    x: X,
    trash: Trash2,
    eyeoff: EyeOff,
    externallink: ExternalLink,
    edit: Edit,
    search: Search,
    filetext: FileText,
    arrowleft: ArrowLeft,
    download: Download,
    save: Save,
    pluscircle: PlusCircle,
    chevronleft: ChevronLeft,
    eye: Eye,
    users: Users,
    sparkles: Sparkles,
};

const AppIcon = ({ name, size = 16, className = '' }) => {
    if (name && typeof name !== 'string') {
        const Icon = name;
        return <Icon size={size} className={className} />;
    }
    const Icon = iconMap[name?.toLowerCase()?.replace(/\s+/g, '')];
    if (!Icon) return null;
    return <Icon size={size} className={className} />;
};

export default AppIcon;
