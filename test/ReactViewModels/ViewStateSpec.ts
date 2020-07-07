import { runInAction } from "mobx";
import Terria from "../../lib/Models/Terria";
import ViewState from "../../lib/ReactViewModels/ViewState";
import RollbarErrorProvider from "../../lib/Models/RollbarErrorProvider";
import SimpleCatalogItem from "../Helpers/SimpleCatalogItem";

describe("ViewState", function() {
  let terria: Terria;
  let viewState: ViewState;

  beforeEach(function() {
    terria = new Terria();
    viewState = new ViewState({
      terria,
      catalogSearchProvider: undefined,
      locationSearchProviders: []
    });
  });

  describe("removeModelReferences", function() {
    it("unsets the previewedItem if it matches the model", function() {
      const item = new SimpleCatalogItem("testId", terria);
      viewState.previewedItem = item;
      viewState.removeModelReferences(item);
      expect(viewState.previewedItem).toBeUndefined();
    });

    it("unsets the userDataPreviewedItem if it matches the model", function() {
      const item = new SimpleCatalogItem("testId", terria);
      viewState.userDataPreviewedItem = item;
      viewState.removeModelReferences(item);
      expect(viewState.userDataPreviewedItem).toBeUndefined();
    });
  });

  describe("error provider", function() {
    it("creates an empty error provider by default", function() {
      expect(viewState.errorProvider).toBeNull();
    });

    it("can create an error provider with rollbar", function() {
      terria.configParameters.rollbarAccessToken = "123";
      viewState.errorProvider = new RollbarErrorProvider({
        terria: viewState.terria
      });
      expect(viewState.errorProvider).toBeDefined();
      expect(viewState.errorProvider.errorProvider).toBeDefined();
    });
  });

  describe("tourPointsWithValidRefs", function() {
    it("returns tourPoints ordered by priority", function() {
      runInAction(() => {
        viewState.setTourIndex(0);
        viewState.setShowTour(true);
        (<any>viewState).updateAppRef("TestRef", { current: true });
        (<any>viewState).updateAppRef("TestRef2", { current: true });
        (<any>viewState).updateAppRef("TestRef3", { current: true });
        viewState.tourPoints = [
          {
            appRefName: "TestRef2",
            priority: 20,
            content: "## Motivated by food\n\nNeko loves food"
          },
          {
            appRefName: "TestRef3",
            priority: 30,
            content: "## Lazy\n\nThey like to lounge around all day"
          },
          {
            appRefName: "TestRef",
            priority: 10,
            content: "## Best friends\n\nMochi and neko are best friends"
          }
        ];
      });
      expect(viewState.tourPointsWithValidRefs).toBeDefined();
      expect(viewState.tourPointsWithValidRefs[0].priority).toEqual(10);
      expect(viewState.tourPointsWithValidRefs[1].priority).toEqual(20);
      expect(viewState.tourPointsWithValidRefs[2].priority).toEqual(30);
      expect(viewState.tourPointsWithValidRefs[0].appRefName).toEqual(
        "TestRef"
      );
    });
  });
  describe("tour and trainer interaction", function() {
    it("disables trainer bar if turning on tour", function() {
      runInAction(() => {
        viewState.setTrainerBarExpanded(true);
        viewState.setTrainerBarShowingAllSteps(true);
      });
      expect(viewState.trainerBarExpanded).toEqual(true);
      expect(viewState.trainerBarShowingAllSteps).toEqual(true);
      expect(viewState.showTour).toEqual(false);

      runInAction(() => {
        viewState.setShowTour(true);
      });
      expect(viewState.trainerBarExpanded).toEqual(false);
      expect(viewState.trainerBarShowingAllSteps).toEqual(false);
      expect(viewState.showTour).toEqual(true);
    });
  });
});
