import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changePassword } from '@/store/auth'
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react'

const SetNewPassword = () => {
    const dispatch = useDispatch()
    const { user, loading } = useSelector((state) => state.auth)
    
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    })
    
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.oldPassword) {
            newErrors.oldPassword = 'Current password is required'
        }
        
        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required'
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters'
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }
        
        if (formData.oldPassword && formData.newPassword && formData.oldPassword === formData.newPassword) {
            newErrors.newPassword = 'New password must be different from current password'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccess('')
        
        if (!validateForm()) return
        
        try {
            const result = await dispatch(changePassword({
                userId: user?.id || user?._id,
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            })).unwrap()
            
            setSuccess('Password changed successfully!')
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            
        } catch (error) {
            setErrors({
                submit: error.message || 'Failed to change password'
            })
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white border-2 border-green-500 rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-500 mb-2">Change Password</h2>
                        <p className="text-gray-600">Update your account password</p>
                    </div>

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-500 rounded-lg flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-green-700">{success}</span>
                        </div>
                    )}

                    {errors.submit && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-500 rounded-lg flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                            <span className="text-red-700">{errors.submit}</span>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-green-500 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.old ? "text" : "password"}
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.oldPassword 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-green-500 focus:border-green-600'
                                    }`}
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('old')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-600"
                                >
                                    {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.oldPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.oldPassword}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-500 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.newPassword 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-green-500 focus:border-green-600'
                                    }`}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-600"
                                >
                                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-500 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.confirmPassword 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-green-500 focus:border-green-600'
                                    }`}
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-600"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Changing Password...
                                </div>
                            ) : (
                                'Change Password'
                            )}
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="text-sm font-medium text-green-700 mb-2">Password Requirements:</h4>
                        <ul className="text-xs text-green-600 space-y-1">
                            <li>• At least 6 characters long</li>
                            <li>• Different from your current password</li>
                            <li>• Should be unique and secure</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetNewPassword