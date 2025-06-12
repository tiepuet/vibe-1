import { create } from 'zustand';
import { Event, Project, Team, Idea, Criteria } from '../types';
import { 
  mockEvents, 
  mockProjects, 
  mockTeams, 
  mockIdeas, 
  mockCriteria,
  mockTeamMembers,
  mockUsers
} from '../data/mockData';

interface DataState {
  events: Event[];
  projects: Project[];
  teams: Team[];
  ideas: Idea[];
  criteria: Criteria[];
  getEventById: (id: string) => Event | undefined;
  getProjectById: (id: string) => Project | undefined;
  getTeamsByEvent: (eventId: string) => Team[];
  getIdeasByEvent: (eventId: string) => Idea[];
  getCriteriaByEvent: (eventId: string) => Criteria[];
  getProjectsByEvent: (eventId: string) => Project[];
  getTeamMembers: (teamId: string) => any[];
  addEvent: (eventData: Partial<Event>) => Promise<void>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  events: mockEvents,
  projects: mockProjects,
  teams: mockTeams,
  ideas: mockIdeas,
  criteria: mockCriteria,

  getEventById: (id: string) => {
    return get().events.find(event => event.id === id);
  },

  getProjectById: (id: string) => {
    return get().projects.find(project => project.id === id);
  },

  getTeamsByEvent: (eventId: string) => {
    return get().teams.filter(team => team.event_id === eventId);
  },

  getIdeasByEvent: (eventId: string) => {
    return get().ideas.filter(idea => idea.event_id === eventId);
  },

  getCriteriaByEvent: (eventId: string) => {
    return get().criteria.filter(criteria => criteria.event_id === eventId);
  },

  getProjectsByEvent: (eventId: string) => {
    return get().projects.filter(project => project.event_id === eventId);
  },

  getTeamMembers: (teamId: string) => {
    const teamMemberIds = mockTeamMembers
      .filter(tm => tm.team_id === teamId)
      .map(tm => tm.user_id);
    
    return mockUsers.filter(user => teamMemberIds.includes(user.id));
  },

  addEvent: async (eventData: Partial<Event>) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      name: eventData.name!,
      slogan: eventData.slogan || null,
      description: eventData.description || null,
      image_url: eventData.image_url || null,
      start_time: eventData.start_time!,
      end_time: eventData.end_time!,
      status: eventData.status || 'draft',
      created_by: eventData.created_by || null,
      created_at: new Date().toISOString()
    };

    set(state => ({
      events: [...state.events, newEvent]
    }));
  },

  updateEvent: async (id: string, eventData: Partial<Event>) => {
    set(state => ({
      events: state.events.map(event => 
        event.id === id 
          ? { ...event, ...eventData }
          : event
      )
    }));
  },

  deleteEvent: async (id: string) => {
    set(state => ({
      events: state.events.filter(event => event.id !== id)
    }));
  },

  updateProject: async (id: string, projectData: Partial<Project>) => {
    set(state => ({
      projects: state.projects.map(project => 
        project.id === id 
          ? { ...project, ...projectData }
          : project
      )
    }));
  }
}));