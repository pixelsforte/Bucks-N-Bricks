import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  User,
  Upload,
  X,
  Briefcase,
  Building,
  RefreshCw,
} from 'lucide-react';
import { TeamMember } from '../../types';
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../../services/api';

export function TeamMembersManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form input states
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formQualification, setFormQualification] = useState('');
  const [formCompany, setFormCompany] = useState('Bucks n Bricks');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const [deleteMemberName, setDeleteMemberName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTeamMembers({ search: searchTerm });
      setMembers(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load team members.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchMembers]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const openAddModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormRole('');
    setFormBio('');
    setFormQualification('');
    setFormCompany('Bucks n Bricks');
    setFormIsActive(true);
    setFormImageFile(null);
    setFormImagePreview('');
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormName(member.name || member.author || '');
    setFormRole(member.role || member.designation || '');
    setFormBio(member.bio || member.quote || member.description || '');
    setFormQualification(member.qualification || '');
    setFormCompany(member.company || 'Bucks n Bricks');
    setFormIsActive(member.isActive !== false);
    setFormImageFile(null);
    setFormImagePreview(member.image || member.avatar || member.picture || '');
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFormImagePreview(objectUrl);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formName.trim()) {
      newErrors.name = 'Full Name is required.';
    }
    if (!formRole.trim()) {
      newErrors.role = 'Job Title / Designation is required.';
    }
    if (!formBio.trim()) {
      newErrors.bio = 'Short description or bio is required.';
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', formName.trim());
      formData.append('role', formRole.trim());
      formData.append('bio', formBio.trim());
      formData.append('qualification', formQualification.trim());
      formData.append('company', formCompany.trim());
      formData.append('isActive', String(formIsActive));

      if (formImageFile) {
        formData.append('image', formImageFile);
      } else if (editingMember && (editingMember.image || editingMember.avatar)) {
        formData.append('image', editingMember.image || editingMember.avatar || '');
      }

      if (editingMember) {
        const id = editingMember.id || editingMember._id!;
        await updateTeamMember(id, formData);
        setSuccessMessage(`Team member "${formName}" updated successfully.`);
      } else {
        await createTeamMember(formData);
        setSuccessMessage(`Team member "${formName}" added successfully.`);
      }

      setIsFormModalOpen(false);
      fetchMembers();
    } catch (err: any) {
      setError(err.message || 'Failed to save team member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteMemberId) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteTeamMember(deleteMemberId);
      setSuccessMessage(`Team member "${deleteMemberName}" deleted successfully.`);
      setDeleteMemberId(null);
      fetchMembers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete team member.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#011c30] tracking-tight">
            Team Members
          </h1>
          <p className="text-slate-500 font-sans text-xs sm:text-sm mt-1">
            Manage company team members and their testimonials shown on the public site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMembers}
            disabled={loading}
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer disabled:opacity-50"
            title="Refresh List"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#052842] hover:bg-[#011c30] text-white font-sans text-xs font-bold py-2.5 px-5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm flex items-start gap-3 shadow-xs"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">{error}</div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-600 ml-auto"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs sm:text-sm flex items-center gap-3 shadow-xs"
          >
            <CheckCircle size={18} className="shrink-0 text-emerald-600" />
            <div className="flex-1">{successMessage}</div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-600 ml-auto"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role, bio, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading && members.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="text-xs font-medium">Loading team members...</span>
          </div>
        ) : members.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <User size={26} />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-display">No Team Members Found</h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-sm mt-1 mb-4">
              {searchTerm
                ? 'No team members match your current search query.'
                : 'Click "+ Add Team Member" to add your first member.'}
            </p>
            {!searchTerm && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 bg-[#052842] hover:bg-[#011c30] text-white font-sans text-xs font-bold py-2.5 px-5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Team Member</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Member</th>
                  <th className="py-3.5 px-5">Designation / Role</th>
                  <th className="py-3.5 px-5">Company</th>
                  <th className="py-3.5 px-5">Short Bio / Quote</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {members.map((member) => {
                  const id = member.id || member._id!;
                  const memberImage = member.image || member.avatar || member.picture;
                  const memberName = member.name || member.author || 'Unnamed';
                  const memberRole = member.role || member.designation || 'Specialist';
                  const memberBio = member.bio || member.quote || member.description || '';

                  return (
                    <tr key={id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {memberImage ? (
                            <img
                              src={memberImage}
                              alt={memberName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                              {memberName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-slate-800 block truncate">
                              {memberName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium block truncate">
                              ID: {id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 font-medium text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Briefcase size={14} className="text-slate-400 shrink-0" />
                          <span>{memberRole}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Building size={14} className="text-slate-400 shrink-0" />
                          <span>{member.company || 'Bucks n Bricks'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-500 max-w-xs">
                        <p className="line-clamp-2 italic text-xs leading-relaxed">
                          "{memberBio}"
                        </p>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            member.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {member.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(member)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Member"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteMemberId(id);
                              setDeleteMemberName(memberName);
                            }}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Member"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Team Member Modal */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold font-display text-[#011c30]">
                    {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill in the member's details. These will be displayed in the testimonials section.
                  </p>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Profile Picture Upload & Preview */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center shrink-0">
                      {formImagePreview ? (
                        <img
                          src={formImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={28} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Upload size={14} />
                        <span>{formImagePreview ? 'Change Picture' : 'Upload Picture'}</span>
                      </button>
                      <p className="text-[11px] text-slate-400 mt-1">
                        PNG, JPG, or WEBP. Max 10MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Muhammad Zeeshan Asif"
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                      formErrors.name ? 'border-rose-400' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Job Title / Designation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Job Title / Designation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. General Manager HR or Director Operations"
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                      formErrors.role ? 'border-rose-400' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {formErrors.role && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.role}</p>
                  )}
                </div>

                {/* Academic Qualification */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Qualification / Academic Background
                  </label>
                  <input
                    type="text"
                    value={formQualification}
                    onChange={(e) => setFormQualification(e.target.value)}
                    placeholder="e.g. MBA in Marketing or BSc Computer Science"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Company / Organization */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Bucks n Bricks or Client Company"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Short Description / Bio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Short Description / Bio / Testimonial Quote <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    placeholder="Write a short summary, leadership bio, or professional testimonial statement..."
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                      formErrors.bio ? 'border-rose-400' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {formErrors.bio && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.bio}</p>
                  )}
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="formIsActive"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="formIsActive" className="text-xs font-medium text-slate-700 cursor-pointer">
                    Active (display in the public testimonial presentation)
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-[#052842] hover:bg-[#011c30] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingMember ? 'Save Changes' : 'Create Member'}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteMemberId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800 font-display mb-1">
                Delete Team Member
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Are you sure you want to delete <strong className="text-slate-700">"{deleteMemberName}"</strong>? This will remove them from the testimonials presentation.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteMemberId(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
