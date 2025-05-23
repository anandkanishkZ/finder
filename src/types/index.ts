export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  reputationScore: number;
  verifiedFinds: number;
  successfulReturns: number;
  phoneNumber?: string;
  preferredMeetingPoints?: string[];
};

export type ItemStatus = 'lost' | 'found' | 'claimed' | 'returned' | 'verified' | 'disputed';

export type ItemCategory = 
  | 'electronics' 
  | 'jewelry' 
  | 'clothing' 
  | 'documents' 
  | 'keys' 
  | 'pets' 
  | 'accessories'
  | 'person'
  | 'other';

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Item = {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  status: ItemStatus;
  date: Date;
  location: string;
  coordinates?: Coordinates;
  imageUrl?: string;
  anonymous: boolean;
  userId: string;
  contactInfo: string;
  createdAt: Date;
  qrCode: string;
  reward?: {
    amount: number;
    currency: string;
    description: string;
  };
  verificationCode?: string;
  safetyMeetingPoint?: {
    name: string;
    address: string;
    coordinates: Coordinates;
    availableTimes: string[];
  };
  statusHistory: {
    status: ItemStatus;
    timestamp: Date;
    updatedBy: string;
    notes?: string;
  }[];
  matchScore?: number;
  views: number;
  reports: number;
};

export type Claim = {
  id: string;
  itemId: string;
  claimerId: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'verified';
  createdAt: Date;
  verificationProof?: string[];
  meetingDetails?: {
    location: string;
    coordinates: Coordinates;
    dateTime: Date;
    status: 'scheduled' | 'completed' | 'cancelled';
  };
  rewardStatus?: 'pending' | 'paid' | 'disputed';
};

export type SafetyPoint = {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  type: 'police' | 'mall' | 'library' | 'other';
  operatingHours: {
    day: string;
    open: string;
    close: string;
  }[];
  verificationProcess: string;
  securityFeatures: string[];
};

export type Notification = {
  id: string;
  userId: string;
  type: 'match' | 'claim' | 'message' | 'status' | 'verification' | 'reward';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  itemId: string;
  content: string;
  createdAt: Date;
  read: boolean;
  attachments?: string[];
};

export type VerificationRequest = {
  id: string;
  itemId: string;
  requesterId: string;
  proofType: 'photo' | 'document' | 'description' | 'receipt';
  proofContent: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedBy?: string;
  reviewNotes?: string;
};

export type Report = {
  id: string;
  itemId: string;
  reporterId: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  evidence?: string[];
};