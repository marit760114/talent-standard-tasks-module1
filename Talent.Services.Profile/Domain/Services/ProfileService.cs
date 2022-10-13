﻿using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<UserSkill> _userSkillRepository;
        IRepository<UserExperience> _userExperienceRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<UserSkill> userSkillRepository,
                              IRepository<UserExperience> userExperienceRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userSkillRepository = userSkillRepository;
            _userExperienceRepository = userExperienceRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            if (language.Id == null)
            {
                UserLanguage addLang = new UserLanguage();
                addLang.Language = language.Name;
                addLang.LanguageLevel = language.Level;
                addLang.UserId = language.CurrentUserId;

                _userLanguageRepository.Add(addLang);
                return true;
            }
            return false;

            //throw new NotImplementedException();
        }

        public async Task<bool> UpdateNewLanguage(AddLanguageViewModel model)
        {

            if (model.Id != null)
            {
                var updateLang = new UserLanguage();
                updateLang.Language = model.Name;
                updateLang.LanguageLevel = model.Level;
                updateLang.UserId = model.CurrentUserId;
                updateLang.Id = model.Id;
                await _userLanguageRepository.Update(updateLang);
                return true;
            }
            return false;
        }


        public async Task<bool> DeleteLanguage(AddLanguageViewModel model)
        {
            if (model.Id != null)
            {
                UserLanguage delLang = new UserLanguage();
                delLang.Id = model.Id;
                delLang.Language = model.Name;
                delLang.LanguageLevel = model.Level;
                delLang.IsDeleted = true;

                /*DeleteLanguageFromView(model, delLang);*/
                await _userLanguageRepository.Delete(delLang);
                return true;
            }
            return false;
        }


        public bool AddNewSkills(AddSkillViewModel skill)
        {
            //Your code here;
            if (skill.Id == null)
            {
                UserSkill addSkill = new UserSkill();              
                addSkill.Skill = skill.Name;
                addSkill.ExperienceLevel = skill.Level;
                addSkill.UserId = skill.CurrentUserId;

                _userSkillRepository.Add(addSkill);
                return true;
            }
            return false;

            //throw new NotImplementedException();
        }

        public async Task<bool> UpdateNewSkill(AddSkillViewModel model)
        {

            if (model.Id != null)
            {
                var updateskill = new UserSkill();
                updateskill.Skill = model.Name;
                updateskill.ExperienceLevel = model.Level;
                updateskill.Id = model.Id;
                await _userSkillRepository.Update(updateskill);
                return true;
            }
            return false;
        }

        public bool AddNewExperience(ExperienceViewModel exp)
        {
            //Your code here;
            if (exp.Id == null)
            {
                UserExperience addExp = new UserExperience();
                addExp.Company = exp.Company;
                addExp.Position = exp.Position;
                addExp.Responsibilities = exp.Responsibilities;
                addExp.Start = addExp.Start;
                addExp.End = addExp.End;

                _userExperienceRepository.Add(addExp);
                return true;
            }
            return false;

            //throw new NotImplementedException();
        }


        public async Task<bool> UpdateNewExperience(ExperienceViewModel model)
        {

            if (model.Id != null)
            {
                var updateExperience = new UserExperience();
                updateExperience.Company = model.Company;
                updateExperience.Position = model.Position;
                updateExperience.Responsibilities = model.Responsibilities;
                updateExperience.Start = model.Start;
                updateExperience.End = model.End;
                await _userExperienceRepository.Update(updateExperience);
                return true;
            }
            return false;
        }


        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            //Your code here;
            User user = null;
            user = (await _userRepository.GetByIdAsync(Id));
            if (user != null)
            {
                //var experience = user.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var languages = user.Languages.Select(x => ViewModelFromLanguages(x)).ToList();
                var skill = user.Skills.Select(x => ViewModelFromSkill(x)).ToList();
                var experience = user.Experience.Select(x => ViewModelExperience(x)).ToList();

                var result = new TalentProfileViewModel
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    Phone = user.Phone,
                    LastName = user.LastName,
                    MiddleName = user.MiddleName,
                    Languages = languages,
                    Skills = skill,
                    Experience = experience,
                    Email = user.Email,
                    MobilePhone = user.MobilePhone,
                    IsMobilePhoneVerified = user.IsMobilePhoneVerified,
                    Nationality = user.Nationality,
                    VisaStatus = user.VisaStatus,
                    VisaExpiryDate = user.VisaExpiryDate,
                    ProfilePhoto = user.ProfilePhoto,
                    ProfilePhotoUrl = user.ProfilePhotoUrl,
                    VideoName = user.VideoName,
                    CvName = user.CvName,
                    Summary = user.Summary,
                    Description = user.Description,
                    LinkedAccounts = user.LinkedAccounts,
                    Address = user.Address,
                    JobSeekingStatus = user.JobSeekingStatus
                };
                return result;
            }
            return null;
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            //Your code here;
            //PC COMMIT

            try
            {
                if (model.Id != null)
                {
                    var newLang = new List<UserLanguage>();
                    User existingUser = (await _userRepository.GetByIdAsync(model.Id));
                    foreach (var item in model.Languages)
                    {
                        var languages = existingUser.Languages.FirstOrDefault(x => x.Id == item.Id);
                        if (languages == null)
                        {
                            languages = new UserLanguage
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }

                        UpdateLanguageFromView(item, languages);
                        newLang.Add(languages);
                        /*else
                        {
                            languages.IsDeleted = true;
                            languages.Id = item.Id;
                        }

                        if (languages.IsDeleted == true)
                        {
                            DeleteLanguageFromView(item, languages);
                            newLang.Remove(languages);
                        }
                        else
                        {

                            UpdateLanguageFromView(item, languages);
                            newLang.Add(languages);
                        }*/
                    }

                    /*foreach(var items in model.Languages)
                    {
                        var languages = existingUser.Languages.FirstOrDefault(x => x.Id == items.Id);
                        if(languages != null)
                        {
                            languages.IsDeleted = true;
                        }
                        UpdateLanguageFromView(items, languages);
                        newLang.Remove(languages);
                    }*/

                    var newSkill = new List<UserSkill>();
                    foreach (var item in model.Skills)
                    {
                        var skills = existingUser.Skills.FirstOrDefault(x => x.Id == item.Id);
                        if (skills == null)
                        {
                            skills = new UserSkill
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateSkillFromView(item, skills);
                        newSkill.Add(skills);
                    }

                    var newExp = new List<UserExperience>();
                    foreach (var item in model.Experience)
                    {
                        var exp = existingUser.Experience.FirstOrDefault(x => x.Id == item.Id);
                        if (exp == null)
                        {
                            exp = new UserExperience
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateExperienceFromView(item, exp);
                        newExp.Add(exp);
                    }


                    existingUser.Languages = newLang;
                    existingUser.Skills = newSkill;
                    existingUser.Experience = newExp;
                    existingUser.Phone = model.Phone;
                    existingUser.FirstName = model.FirstName;
                    existingUser.LastName = model.LastName;
                    existingUser.MiddleName = model.MiddleName;
                    existingUser.Email = model.Email;
                    existingUser.MobilePhone = model.MobilePhone;
                    existingUser.IsMobilePhoneVerified = model.IsMobilePhoneVerified;
                    existingUser.Nationality = model.Nationality;
                    existingUser.VisaStatus = model.VisaStatus;
                    existingUser.VisaExpiryDate = model.VisaExpiryDate;
                    existingUser.ProfilePhoto = model.ProfilePhoto;
                    existingUser.ProfilePhotoUrl = model.ProfilePhotoUrl;
                    existingUser.VideoName = model.VideoName;
                    existingUser.CvName = model.CvName;
                    existingUser.Summary = model.Summary;
                    existingUser.Description = model.Description;
                    existingUser.Address = model.Address;
                    existingUser.LinkedAccounts = model.LinkedAccounts;
                    /*existingUser.LinkedAccounts.LinkedIn = model.LinkedAccounts.LinkedIn;
                    existingUser.LinkedAccounts.Github = model.LinkedAccounts.Github;*/
                    existingUser.JobSeekingStatus = model.JobSeekingStatus;
                    existingUser.UpdatedBy = updaterId;
                    existingUser.UpdatedOn = DateTime.Now;



                    /*var newLang = new List<UserLanguage>();
                    foreach (var item in model.Languages)
                    {
                        var languages = existingUser.Languages.SingleOrDefault(x => x.Id == null);
                        if (languages == null)
                        {
                            languages = new UserLanguage
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateLanguageFromView(item, languages);
                        newLang.Add(languages);
                    }
                    existingUser.Languages = newLang;*/

                    await _userRepository.Update(existingUser);

                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }


        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }
        protected void UpdateExperienceFromView(ExperienceViewModel model, UserExperience original)
        {
            original.Company = model.Company;
            original.Position = model.Position;
            original.Responsibilities = model.Responsibilities;
            original.Start = model.Start;
            original.End = model.End;
        }


        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            /*original.Id = model.Id;*/
            original.LanguageLevel = model.Level;
            original.Language = model.Name;
        }

        protected void DeleteLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.Id = model.Id;
            original.LanguageLevel = model.Level;
            original.Language = model.Name;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected ExperienceViewModel ViewModelExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End
            };
        }

        protected AddLanguageViewModel ViewModelFromLanguages(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Id = language.Id,
                Level = language.LanguageLevel,
                Name = language.Language
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
