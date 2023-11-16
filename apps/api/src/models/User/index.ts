import * as mongoose from 'mongoose';

export enum UserRoles {
  BASIC = 'basic',
  ADMIN = 'admin',
}

export enum UserType {
  EARLY_ACCESS = 'earlyAccess',
  NORMAL = 'normal',
}

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    default: null,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    default: null,
    select: false,
  },
  fullName: {
    type: String,
    default: 'Michella Barkin',
  },
  userName: {
    type: String,
    default: 'MicheBark',
  },
  bio: {
    type: String,
    default: 'There is no Bio',
  },
  emailVerificationCode: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: 'https://robohash.org/repellendussintut.png?size=50x50&set=set1',
  },
  engagement: {
    type: Object,
    default: {
      likes: 150,
      comments: 50,
      following: 250,
    },
  },
  posts: {
    type: Object,
    default: {
      history: [
        {
          id: 1,
          url: 'https://robohash.org/porroquaeminus.png?size=50x50&set=set1',
        },
        {
          id: 2,
          url:
            'https://robohash.org/eligendiitaquetotam.png?size=50x50&set=set1',
        },
        {
          id: 3,
          url: 'https://robohash.org/porroquaeminus.png?size=50x50&set=set1',
        },
        {
          id: 4,
          url: 'https://robohash.org/laboriosamestaut.png?size=50x50&set=set1',
        },
        {
          id: 5,
          url: 'https://robohash.org/dictarerumomnis.png?size=50x50&set=set1',
        },

        {
          id: 6,
          url: 'https://robohash.org/aliquamquaesunt.png?size=50x50&set=set1',
        },
        {
          id: 7,
          url:
            'https://robohash.org/eaqueaccusamusassumenda.png?size=50x50&set=set1',
        },
        {
          id: 8,
          url:
            'https://robohash.org/occaecatidoloresrem.png?size=50x50&set=set1',
        },
        {
          id: 9,
          url:
            'https://robohash.org/doloruminventorevelit.png?size=50x50&set=set1',
        },
        {
          id: 10,
          url:
            'https://robohash.org/earumsequiofficiis.png?size=50x50&set=set1',
        },
      ],
      saved: [
        {
          id: 1,
          url: 'https://robohash.org/nihilethic.png?size=50x50&set=set1',
        },
        {
          id: 2,
          url:
            'https://robohash.org/voluptasofficiisdistinctio.png?size=50x50&set=set1',
        },
        {
          id: 3,
          url: 'https://robohash.org/hicquiid.png?size=50x50&set=set1',
        },
        {
          id: 4,
          url:
            'https://robohash.org/accusamusanimiexercitationem.png?size=50x50&set=set1',
        },
        {
          id: 5,
          url: 'https://robohash.org/asitaccusamus.png?size=50x50&set=set1',
        },

        {
          id: 6,
          url: 'https://robohash.org/remmaximeeum.png?size=50x50&set=set1',
        },
        {
          id: 7,
          url: 'https://robohash.org/eanesciuntdolor.png?size=50x50&set=set1',
        },
        {
          id: 8,
          url: 'https://robohash.org/sequietmolestiae.png?size=50x50&set=set1',
        },
        {
          id: 9,
          url: 'https://robohash.org/sitetaut.png?size=50x50&set=set1',
        },
        {
          id: 10,
          url:
            'https://robohash.org/nonexercitationemassumenda.png?size=50x50&set=set1',
        },
      ],
    },
  },
  role: {
    type: String,
    default: UserRoles.BASIC,
    enum: UserRoles,
  },
  userType: {
    type: String,
    default: UserType.NORMAL,
    enum: UserType,
  },
  authenticatedByGoogle: {
    type: Boolean,
    default: false,
  },
});

export const User = mongoose.model('User', userSchema);
