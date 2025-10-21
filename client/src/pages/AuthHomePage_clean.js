import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoading } from '../context/LoadingContext';
import useNavigateWithLoading from '../hooks/useNavigateWithLoading';
import { ShieldCheck, GraduationCap, Users, FileCheck, ChevronRight } from 'lucide-react';
const AuthHomePage = () => {
  const navigate = useNavigate();
  const navigateWithLoading = useNavigateWithLoading();
  const { hideLoading } = useLoading();
  const [signingInAsAdmin, setSigningInAsAdmin] = useState(false);
  const [signingInAsStudent, setSigningInAsStudent] = useState(false);
  useEffect(() => {
    hideLoading();
    return () => {
      toast.dismiss();
    };
  }, [hideLoading]);
  const handleAdminSignIn = async () => {
    if (signingInAsAdmin || signingInAsStudent) return;
    try {
      setSigningInAsAdmin(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('adminId', 'admin_001');
      localStorage.setItem('adminName', 'Dr. Sarah Wilson');
      localStorage.setItem('adminDepartment', 'Academic Affairs');
      localStorage.setItem('adminRole', 'Registrar');
      toast.success('Admin signed in successfully!', {
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        toastId: 'admin-signin'
      });
      setSigningInAsAdmin(false);
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.dismiss('admin-signin');
      navigateWithLoading('/admin-dashboard', 1000);
    } catch (error) {
      setSigningInAsAdmin(false);
      toast.error('Admin sign-in failed. Please try again.');
    }
  };
  const handleStudentSignIn = async () => {
    if (signingInAsAdmin || signingInAsStudent) return;
    try {
      setSigningInAsStudent(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.setItem('userType', 'student');
      localStorage.setItem('studentId', 'student_001');
      localStorage.setItem('studentName', 'Vansh Ranawat');
      localStorage.setItem('studentEmail', 'john.smith@university.edu');
      localStorage.setItem('studentDepartment', 'Computer Science');
      localStorage.setItem('studentYear', 'Senior');
      toast.success('Student signed in successfully!', {
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        toastId: 'student-signin'
      });
      setSigningInAsStudent(false);
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.dismiss('student-signin');
      navigateWithLoading('/student-dashboard', 1000);
    } catch (error) {
      setSigningInAsStudent(false);
      toast.error('Student sign-in failed. Please try again.');
    }
  };
  const handleBackToHome = () => {
    navigateWithLoading('/', 500);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Secure Certificate
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {" "}Verification
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience the future of academic credential verification with blockchain technology. 
                  Secure, transparent, and tamper-proof certificates for the digital age.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <ShieldCheck className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Secured</h3>
                  <p className="text-gray-600 text-sm">Every certificate is protected by cryptographic hashing</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <FileCheck className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Verification</h3>
                  <p className="text-gray-600 text-sm">Verify authenticity in seconds, not days</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <Users className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-User Platform</h3>
                  <p className="text-gray-600 text-sm">Separate dashboards for administrators and students</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <GraduationCap className="w-12 h-12 text-indigo-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Excellence</h3>
                  <p className="text-gray-600 text-sm">Trusted by universities and educational institutions</p>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Role</h2>
                <p className="text-gray-600">Access your personalized dashboard</p>
              </div>
              <div className="space-y-4">
                <button
                  onClick={handleAdminSignIn}
                  disabled={signingInAsAdmin || signingInAsStudent}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
                >
                  {signingInAsAdmin ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Signing in as Admin...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ShieldCheck className="w-5 h-5 mr-3" />
                      Sign in as Administrator
                      <ChevronRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
                <button
                  onClick={handleStudentSignIn}
                  disabled={signingInAsAdmin || signingInAsStudent}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
                >
                  {signingInAsStudent ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Signing in as Student...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <GraduationCap className="w-5 h-5 mr-3" />
                      Sign in as Student
                      <ChevronRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBackToHome}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  ← Back to Home
                </button>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Demo credentials are automatically loaded for testing purposes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthHomePage;
