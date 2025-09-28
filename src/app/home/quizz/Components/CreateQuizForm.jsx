'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const ROLES = [
  'SDE 1',
  'SDE 2',
  'SDE 3',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'QA Engineer',
  'HR',
  'Product Manager'
];

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

export function CreateQuizForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    topic: '',
    role: '',
    numberOfQuestions: 1,
    difficulty: 'Medium',
    description: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[90%] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Quiz Topic</Label>
              <Input
                id="topic"
                placeholder="Enter quiz topic"
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleChange('role', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(value) => handleChange('difficulty', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="questions">Number of Questions: {formData.numberOfQuestions}</Label>
                <span className="text-sm text-gray-500">Max 20</span>
              </div>
              <Slider
                id="questions"
                min={1}
                max={10}
                step={1}
                value={[formData.numberOfQuestions]}
                onValueChange={([value]) => handleChange('numberOfQuestions', value)}
                className="py-4"
              />
            </div>

            

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a brief description about the quiz"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Quiz</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
