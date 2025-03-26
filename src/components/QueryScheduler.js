import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaClock, FaCalendarAlt, FaPlus, FaTrash, FaPlay, FaPause } from 'react-icons/fa';
import { showSuccess, showInfo, showError } from '../utils/toast';

const SchedulerContainer = styled.div`
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
`;

const SchedulerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SchedulerTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const SchedulesList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ScheduleCard = styled.div`
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  overflow: hidden;
`;

const ScheduleCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
`;

const ScheduleTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
`;

const ScheduleActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 0.25rem;
  transition: var(--transition);
  
  &:hover {
    color: ${props => {
      if (props.$delete) return 'var(--danger-color)';
      if (props.$success) return 'var(--success-color)';
      if (props.$warning) return 'rgb(245, 158, 11)';
      return 'var(--primary-color)';
    }};
  }
`;

const ScheduleContent = styled.div`
  padding: 1rem;
`;

const ScheduleInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: var(--text-light);
`;

const InfoValue = styled.div`
  color: var(--text-color);
  font-weight: 500;
`;

const ScheduleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  background-color: ${props => {
    if (props.$active) return 'rgba(16, 185, 129, 0.2)';
    if (props.$paused) return 'rgba(245, 158, 11, 0.2)';
    return 'rgba(107, 114, 128, 0.2)';
  }};
  
  color: ${props => {
    if (props.$active) return 'var(--success-color)';
    if (props.$paused) return 'rgb(245, 158, 11)';
    return 'var(--text-light)';
  }};
`;

const QueryPreview = styled.pre`
  margin: 0;
  padding: 0.75rem;
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--text-color);
  white-space: pre-wrap;
  max-height: 100px;
  overflow-y: auto;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: var(--text-color);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1.5rem;
  line-height: 0.5;
  cursor: pointer;
  
  &:hover {
    color: var(--danger-color);
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  color: var(--text-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  color: var(--text-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  input {
    width: auto;
  }
`;

const ModalFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  background-color: ${props => {
    if (props.$secondary) return 'transparent';
    if (props.$danger) return 'var(--danger-color)';
    return 'var(--primary-color)';
  }};
  
  color: ${props => props.$secondary ? 'var(--text-color)' : 'white'};
  
  border: ${props => props.$secondary ? '1px solid var(--border-color)' : 'none'};
  
  &:hover {
    background-color: ${props => {
      if (props.$secondary) return 'var(--bg-secondary)';
      if (props.$danger) return 'var(--danger-dark)';
      return 'var(--primary-dark)';
    }};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
`;

const RunHistory = styled.div`
  margin-top: 1rem;
`;

const RunHistoryHeader = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RunHistoryList = styled.div`
  max-height: 150px;
  overflow-y: auto;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
`;

const RunHistoryItem = styled.div`
  padding: 0.5rem 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.85rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const RunStatus = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
  
  background-color: ${props => {
    if (props.$success) return 'var(--success-color)';
    if (props.$error) return 'var(--danger-color)';
    return 'var(--text-light)';
  }};
`;

// Sample frequency options
const FREQUENCY_OPTIONS = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom (minutes)' }
];

// Sample notification options
const NOTIFICATION_OPTIONS = [
  { value: 'always', label: 'Always notify' },
  { value: 'success', label: 'Only on success' },
  { value: 'error', label: 'Only on error' },
  { value: 'never', label: 'Never notify' }
];

const QueryScheduler = ({ queryText, queryName, tabId, currentUser }) => {
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState({
    name: '',
    frequency: 'daily',
    customMinutes: 60,
    notifications: 'always',
    active: true,
    email: true,
    toast: true,
    saveResults: true
  });
  
  // Load schedules from localStorage on component mount
  useEffect(() => {
    const savedSchedules = JSON.parse(localStorage.getItem(`query_schedules_${tabId}`) || '[]');
    setSchedules(savedSchedules);
    
    // Set up interval to check scheduled runs (simulating a cron job)
    const interval = setInterval(() => {
      checkScheduledRuns();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [tabId]);
  
  const checkScheduledRuns = () => {
    // This would normally be handled by a backend job scheduler
    // Here we're just simulating it on the frontend
    const updatedSchedules = schedules.map(schedule => {
      if (!schedule.active) return schedule;
      
      const now = new Date();
      const lastRun = schedule.lastRun ? new Date(schedule.lastRun) : null;
      
      if (!lastRun) {
        // First run
        return runScheduledQuery(schedule);
      }
      
      // Check if it's time to run based on frequency
      let shouldRun = false;
      
      switch(schedule.frequency) {
        case 'hourly':
          shouldRun = (now - lastRun) >= 60 * 60 * 1000;
          break;
        case 'daily':
          shouldRun = (now - lastRun) >= 24 * 60 * 60 * 1000;
          break;
        case 'weekly':
          shouldRun = (now - lastRun) >= 7 * 24 * 60 * 60 * 1000;
          break;
        case 'monthly':
          // Simple approximation
          shouldRun = (now - lastRun) >= 30 * 24 * 60 * 60 * 1000;
          break;
        case 'custom':
          shouldRun = (now - lastRun) >= schedule.customMinutes * 60 * 1000;
          break;
        default:
          break;
      }
      
      if (shouldRun) {
        return runScheduledQuery(schedule);
      }
      
      return schedule;
    });
    
    setSchedules(updatedSchedules);
    localStorage.setItem(`query_schedules_${tabId}`, JSON.stringify(updatedSchedules));
  };
  
  const runScheduledQuery = (schedule) => {
    // In a real app, this would send the query to the backend
    // Here we simulate a successful run most of the time
    const success = Math.random() > 0.2; // 80% success rate
    
    const run = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      success,
      message: success ? "Query completed successfully" : "Error executing query",
      rows: success ? Math.floor(Math.random() * 100) + 1 : 0
    };
    
    // Send notification based on settings
    if (
      (schedule.notifications === 'always') ||
      (schedule.notifications === 'success' && success) ||
      (schedule.notifications === 'error' && !success)
    ) {
      if (schedule.toast) {
        if (success) {
          showSuccess(`Scheduled query "${schedule.name}" completed successfully`);
        } else {
          showError(`Scheduled query "${schedule.name}" failed`);
        }
      }
      
      // In a real app, we would also send email notifications
      if (schedule.email) {
        console.log(`Email notification sent to ${currentUser?.email || 'user'}`);
      }
    }
    
    // Update the schedule with the run history
    return {
      ...schedule,
      lastRun: new Date().toISOString(),
      nextRun: calculateNextRun(schedule),
      runHistory: [run, ...(schedule.runHistory || [])].slice(0, 10) // Keep last 10 runs
    };
  };
  
  const calculateNextRun = (schedule) => {
    const now = new Date();
    let nextRun = new Date();
    
    switch(schedule.frequency) {
      case 'hourly':
        nextRun.setHours(nextRun.getHours() + 1);
        break;
      case 'daily':
        nextRun.setDate(nextRun.getDate() + 1);
        break;
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + 7);
        break;
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1);
        break;
      case 'custom':
        nextRun = new Date(now.getTime() + schedule.customMinutes * 60 * 1000);
        break;
      default:
        break;
    }
    
    return nextRun.toISOString();
  };
  
  const handleAddSchedule = () => {
    setCurrentSchedule({
      name: queryName || 'Scheduled Query',
      frequency: 'daily',
      customMinutes: 60,
      notifications: 'always',
      active: true,
      email: true,
      toast: true,
      saveResults: true
    });
    
    setShowModal(true);
  };
  
  const handleSaveSchedule = () => {
    if (!currentSchedule.name.trim()) {
      showError('Schedule name is required');
      return;
    }
    
    if (currentSchedule.frequency === 'custom' && 
        (!currentSchedule.customMinutes || currentSchedule.customMinutes < 5)) {
      showError('Custom interval must be at least 5 minutes');
      return;
    }
    
    // Create a new schedule
    const newSchedule = {
      ...currentSchedule,
      id: Date.now(),
      query: queryText,
      createdAt: new Date().toISOString(),
      nextRun: calculateNextRun(currentSchedule),
      runHistory: []
    };
    
    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    localStorage.setItem(`query_schedules_${tabId}`, JSON.stringify(updatedSchedules));
    
    setShowModal(false);
    showSuccess(`Query scheduled to run ${currentSchedule.frequency}`);
  };
  
  const handleDeleteSchedule = (id) => {
    const updatedSchedules = schedules.filter(schedule => schedule.id !== id);
    setSchedules(updatedSchedules);
    localStorage.setItem(`query_schedules_${tabId}`, JSON.stringify(updatedSchedules));
    showInfo('Schedule deleted');
  };
  
  const handleToggleActive = (id) => {
    const updatedSchedules = schedules.map(schedule => {
      if (schedule.id === id) {
        const updated = {
          ...schedule,
          active: !schedule.active,
          nextRun: schedule.active ? null : calculateNextRun(schedule)
        };
        
        // Show notification
        if (updated.active) {
          showSuccess(`Schedule "${schedule.name}" activated`);
        } else {
          showInfo(`Schedule "${schedule.name}" paused`);
        }
        
        return updated;
      }
      return schedule;
    });
    
    setSchedules(updatedSchedules);
    localStorage.setItem(`query_schedules_${tabId}`, JSON.stringify(updatedSchedules));
  };
  
  const handleRunNow = (id) => {
    const updatedSchedules = schedules.map(schedule => {
      if (schedule.id === id) {
        showInfo(`Running scheduled query "${schedule.name}" now...`);
        return runScheduledQuery(schedule);
      }
      return schedule;
    });
    
    setSchedules(updatedSchedules);
    localStorage.setItem(`query_schedules_${tabId}`, JSON.stringify(updatedSchedules));
  };
  
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };
  
  const getFrequencyLabel = (schedule) => {
    if (schedule.frequency === 'custom') {
      return `Every ${schedule.customMinutes} minutes`;
    }
    
    const option = FREQUENCY_OPTIONS.find(opt => opt.value === schedule.frequency);
    return option ? option.label : schedule.frequency;
  };
  
  return (
    <SchedulerContainer>
      <SchedulerHeader>
        <SchedulerTitle>
          <FaClock /> Scheduled Queries
        </SchedulerTitle>
        <AddButton onClick={handleAddSchedule}>
          <FaPlus size={12} /> Add Schedule
        </AddButton>
      </SchedulerHeader>
      
      <SchedulesList>
        {schedules.length === 0 ? (
          <EmptyState>
            No scheduled queries yet. Add a schedule to run this query automatically.
          </EmptyState>
        ) : (
          schedules.map(schedule => (
            <ScheduleCard key={schedule.id}>
              <ScheduleCardHeader>
                <ScheduleTitle>{schedule.name}</ScheduleTitle>
                <ScheduleActions>
                  <ActionButton 
                    onClick={() => handleRunNow(schedule.id)}
                    title="Run now"
                    $success
                  >
                    <FaPlay size={14} />
                  </ActionButton>
                  <ActionButton 
                    onClick={() => handleToggleActive(schedule.id)}
                    title={schedule.active ? "Pause schedule" : "Activate schedule"}
                    $warning={schedule.active}
                  >
                    {schedule.active ? <FaPause size={14} /> : <FaPlay size={14} />}
                  </ActionButton>
                  <ActionButton 
                    $delete
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    title="Delete schedule"
                  >
                    <FaTrash size={14} />
                  </ActionButton>
                </ScheduleActions>
              </ScheduleCardHeader>
              
              <ScheduleContent>
                <ScheduleInfo>
                  <InfoItem>
                    <InfoLabel>Status</InfoLabel>
                    <InfoValue>
                      <ScheduleBadge $active={schedule.active} $paused={!schedule.active}>
                        {schedule.active ? 'Active' : 'Paused'}
                      </ScheduleBadge>
                    </InfoValue>
                  </InfoItem>
                  
                  <InfoItem>
                    <InfoLabel>Frequency</InfoLabel>
                    <InfoValue>{getFrequencyLabel(schedule)}</InfoValue>
                  </InfoItem>
                  
                  <InfoItem>
                    <InfoLabel>Last Run</InfoLabel>
                    <InfoValue>{schedule.lastRun ? formatDateTime(schedule.lastRun) : 'Never'}</InfoValue>
                  </InfoItem>
                  
                  <InfoItem>
                    <InfoLabel>Next Run</InfoLabel>
                    <InfoValue>{schedule.active ? formatDateTime(schedule.nextRun) : 'Paused'}</InfoValue>
                  </InfoItem>
                </ScheduleInfo>
                
                <QueryPreview>
                  {schedule.query}
                </QueryPreview>
                
                {schedule.runHistory && schedule.runHistory.length > 0 && (
                  <RunHistory>
                    <RunHistoryHeader>
                      <FaCalendarAlt size={14} /> Run History
                    </RunHistoryHeader>
                    <RunHistoryList>
                      {schedule.runHistory.map(run => (
                        <RunHistoryItem key={run.id}>
                          <span>
                            <RunStatus $success={run.success} $error={!run.success} />
                            {formatDateTime(run.timestamp)}
                          </span>
                          <span>
                            {run.success ? `${run.rows} rows` : 'Failed'}
                          </span>
                        </RunHistoryItem>
                      ))}
                    </RunHistoryList>
                  </RunHistory>
                )}
              </ScheduleContent>
            </ScheduleCard>
          ))
        )}
      </SchedulesList>
      
      {/* Add Schedule Modal */}
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Schedule Query</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <FormGroup>
                <Label htmlFor="scheduleName">Schedule Name</Label>
                <Input
                  id="scheduleName"
                  value={currentSchedule.name}
                  onChange={(e) => setCurrentSchedule({ ...currentSchedule, name: e.target.value })}
                  placeholder="Enter a name for this schedule"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="frequency">Run Frequency</Label>
                <Select
                  id="frequency"
                  value={currentSchedule.frequency}
                  onChange={(e) => setCurrentSchedule({ ...currentSchedule, frequency: e.target.value })}
                >
                  {FREQUENCY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              {currentSchedule.frequency === 'custom' && (
                <FormGroup>
                  <Label htmlFor="customMinutes">Run Every (minutes)</Label>
                  <Input
                    id="customMinutes"
                    type="number"
                    min="5"
                    value={currentSchedule.customMinutes}
                    onChange={(e) => setCurrentSchedule({ 
                      ...currentSchedule, 
                      customMinutes: parseInt(e.target.value) || 60 
                    })}
                  />
                </FormGroup>
              )}
              
              <FormGroup>
                <Label htmlFor="notifications">Notifications</Label>
                <Select
                  id="notifications"
                  value={currentSchedule.notifications}
                  onChange={(e) => setCurrentSchedule({ ...currentSchedule, notifications: e.target.value })}
                >
                  {NOTIFICATION_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Notification Methods</Label>
                <Checkbox>
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={currentSchedule.email}
                    onChange={(e) => setCurrentSchedule({ ...currentSchedule, email: e.target.checked })}
                  />
                  <label htmlFor="emailNotifications">Send email notifications</label>
                </Checkbox>
                <Checkbox>
                  <input
                    type="checkbox"
                    id="toastNotifications"
                    checked={currentSchedule.toast}
                    onChange={(e) => setCurrentSchedule({ ...currentSchedule, toast: e.target.checked })}
                  />
                  <label htmlFor="toastNotifications">Show in-app notifications</label>
                </Checkbox>
              </FormGroup>
              
              <FormGroup>
                <Label>Options</Label>
                <Checkbox>
                  <input
                    type="checkbox"
                    id="saveResults"
                    checked={currentSchedule.saveResults}
                    onChange={(e) => setCurrentSchedule({ ...currentSchedule, saveResults: e.target.checked })}
                  />
                  <label htmlFor="saveResults">Save results for later viewing</label>
                </Checkbox>
                <Checkbox>
                  <input
                    type="checkbox"
                    id="activeStatus"
                    checked={currentSchedule.active}
                    onChange={(e) => setCurrentSchedule({ ...currentSchedule, active: e.target.checked })}
                  />
                  <label htmlFor="activeStatus">Activate schedule immediately</label>
                </Checkbox>
              </FormGroup>
            </ModalBody>
            
            <ModalFooter>
              <Button $secondary onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSchedule}>
                <FaClock size={14} /> Schedule Query
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </SchedulerContainer>
  );
};

export default QueryScheduler; 