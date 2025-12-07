import React from 'react';
import { FileText, Calendar, User, Award, Download } from 'lucide-react';
import StatusBadge from './StatusBadge';
import DashboardCard from './DashboardCard';
import AnimatedButton from './AnimatedButton';
const CertificateCard = ({
  certificate,
  onView,
  onRevoke,
  onActivate,
  onVerify,
  onDownload,
  showQR,
  isRevoking = false,
  isActivating = false,
  isVerifying = false,
  isAdmin = false
}) => {
  const isRevoked = certificate.status === 'Revoked' || certificate.status === 'revoked';
  // const isActive = certificate.status === 'Valid' || certificate.status === 'Active'; // unused
  return (
    <DashboardCard className="animate-fade-in">
      <div className="flex flex-col h-full">
        {}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {certificate.course || 'Certificate'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {certificate.certificateId}
                </p>
              </div>
            </div>
            <StatusBadge status={certificate.status} />
          </div>
        </div>
        {}
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <User size={16} />
            <span className="font-medium">{certificate.studentName}</span>
          </div>
          {certificate.degree && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Award size={16} />
              <span>{certificate.degree}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar size={16} />
            <span>
              Issued: {new Date(certificate.issuedAt || certificate.issuedDate).toLocaleDateString()}
            </span>
          </div>
          {certificate.university && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {certificate.university}
            </p>
          )}
        </div>
        {}
        {isRevoked && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
              <span>⚠️</span>
              This certificate is revoked and no longer valid.
            </p>
          </div>
        )}
        {}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {showQR && (
            <div className="flex-shrink-0">
              {showQR}
            </div>
          )}
          {onView && (
            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={() => onView(certificate)}
              icon={<FileText size={16} />}
            >
              View PDF
            </AnimatedButton>
          )}
          {onDownload && (
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={() => onDownload(certificate)}
              icon={<Download size={16} />}
            >
              Download
            </AnimatedButton>
          )}
          {isAdmin && (
            <>
              {!isRevoked && onRevoke && (
                <AnimatedButton
                  variant="danger"
                  size="sm"
                  onClick={() => onRevoke(certificate)}
                  disabled={isRevoking}
                  icon={<FileText size={16} />}
                >
                  {isRevoking ? 'Revoking...' : 'Revoke'}
                </AnimatedButton>
              )}
              {isRevoked && onActivate && (
                <AnimatedButton
                  variant="success"
                  size="sm"
                  onClick={() => onActivate(certificate)}
                  disabled={isActivating}
                  icon={<FileText size={16} />}
                >
                  {isActivating ? 'Activating...' : 'Activate'}
                </AnimatedButton>
              )}
            </>
          )}
          {!isAdmin && onVerify && (
            <AnimatedButton
              variant="success"
              size="sm"
              onClick={() => onVerify(certificate)}
              disabled={isVerifying || isRevoked}
              icon={<FileText size={16} />}
              title={isRevoked ? 'Cannot verify revoked certificate' : 'Verify authenticity'}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </AnimatedButton>
          )}
        </div>
      </div>
    </DashboardCard>
  );
};
export default CertificateCard;
