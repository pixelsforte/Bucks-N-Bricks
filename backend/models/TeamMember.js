import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Job title / designation is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Short description or bio is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: 'Bucks n Bricks',
    },
    qualification: {
      type: String,
      trim: true,
      default: '',
    },
    bgColor: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        // Testimonial presentation compatibility aliases
        ret.author = ret.name;
        ret.designation = ret.role;
        ret.quote = ret.bio;
        ret.avatar = ret.image || '';
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

teamMemberSchema.index({ order: 1, createdAt: -1 });

export const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema);
